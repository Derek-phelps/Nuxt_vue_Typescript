<script lang="ts">
import { Context } from '@nuxt/types'
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class PageArticleSingle extends Vue {
	article: any = {}

	get article_date() {
		return this.$moment(this.article.post_date)
	}

	asyncData({ store, params, error }: Context) {
		const articleID = params.slug
		return store
			.dispatch('articles/fetch_single', articleID)
			.then((article) => ({ article }))
			.catch((err) => {
				console.error('Failed to get article', err)
				error({
					statusCode: 404,
					title: 'Article not found!',
					message: 'The article you were looking for could not be found.',
				})
			})
	}
}
</script>

<template>
	<page v-if="article.id" class="article-single">
		<nuxt-link class="back" to="/">
			<form-button class="flat no-border">
				<span>
					<i class="far fa-chevron-left"></i>
					<span>Back to Calendar</span>
				</span>
			</form-button>
		</nuxt-link>

		<div class="article-content">
			<img
				v-if="article.media"
				:src="article.media.url"
				alt=""
				class="article-media"
			/>

			<h3 class="details-title article-title">
				{{ article.title }}
			</h3>

			<div class="details-datetime article-date">
				<span class="date">{{ article_date.format('MMMM D, YYYY') }}</span>
				<div class="dot" />
				<span class="time">{{ article_date.format('h:mm a') }}</span>
			</div>

			<div class="article-text" v-html="article.text" />
		</div>
	</page>
</template>

<style lang="scss" scoped>
@import '@sassy';

$tablet-width: 1100px;
$mobile-width: 876px;
$media-size: var(--media-size, 200px);

.article-content .article-text::v-deep {
	line-height: 1.25em;

	p {
		padding: 0.25em 0px;
	}

	img {
		margin: 1em;
		border-radius: $border-radius;
		overflow: hidden;
	}
}

.page.article-single {
	display: grid;
	overflow: hidden;

	.article-content {
		display: grid;
		max-width: 700px;
		padding: 1em;
		padding-right: 0.5em;

		color: $that-gray-darker;

		border-radius: $border-radius;
		overflow: hidden;

		@include glass-it(
			linear-gradient(
				90deg,
				rgba(255, 255, 255, 0.6) 0%,
				rgba(211, 247, 255, 0.81) 100%
			),
			20px
		);

		.article-media {
			width: $media-size;
			height: $media-size;

			object-fit: cover;
			object-position: center;

			border-radius: $border-radius;
			overflow: hidden;
		}

		.article-title {
			font-size: 1.2em;
		}

		.article-text {
			padding-right: 0.5em;
			overflow: hidden;
			overflow-y: auto;
		}

		// background-color: white;

		// Grid Positioning
		grid-template-columns: calc(#{$media-size}) 1fr;
		column-gap: 1em;

		grid-template-rows: auto auto 1fr;
		row-gap: 0.5em;

		grid-template-areas:
			'media title title'
			'media date date'
			'media text text';

		.article-media {
			grid-area: media;
		}

		.article-title {
			grid-area: title;
		}

		.article-date {
			grid-area: date;
		}

		.article-text {
			grid-area: text;
		}
	}

	// Grid Positioning
	align-items: start;

	grid-template-columns: 1fr auto 1fr;
	grid-template-rows: auto 1fr;
	grid-template-areas:
		'. back .'
		'. content .';

	.back {
		grid-area: back;
	}

	.article-content {
		grid-area: content;
	}

	// Because of this line most of the CSS grid code above is useless. Oh well, it's there if it's needed and at-least the whole thing is responsive now
	// @include tablet($mobile-width) {
	@include tablet(90000px) {
		.article-content {
			display: block;
			max-height: 100%;
			padding: 2em;

			overflow-y: auto;

			.article-title {
				margin-bottom: 0.5em;
			}

			.article-date {
				margin-bottom: 0.5em;
			}

			.article-media {
				float: right;
				margin-left: 0.5em;
				margin-bottom: 0.5em;
			}

			.article-text {
				display: contents;
				padding: 0px;
			}
		}
	}

	@include tablet(615px) {
		.article-content {
			--media-size: 125px;
		}
	}

	@include tablet(400px) {
		.article-content {
			padding: 1em;

			.article-media {
				float: none;
				width: 100%;
				margin: 0px;
				margin-bottom: 1em;
			}

			&::v-deep {
				* {
					clear: both;
				}

				img {
					width: 100%;
					height: unset;
					margin: 1em 0px;
				}
			}
		}
	}
}

.back {
	justify-self: end;
	flex-shrink: 0;

	margin-bottom: -$border-radius;

	.form-button {
		@include glass-it(rgba(#000, 0.1));
	}

	span {
		@include flex(row, center, center);
		color: white;
		text-decoration: none;

		i {
			@include flex(column, center, center);
			margin-right: 1em;
			color: white;
			font-size: 1.25em;

			border-radius: 100%;
		}
	}
}
</style>
