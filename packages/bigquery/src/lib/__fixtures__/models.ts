import { z, AnyZodObject } from 'zod';
import { convert } from 'zoq';

export const BasePageModel = z.object({
  title: z.string(),
  url: z.string(),
  pathname: z.string(),
  nanoid: z.string(),
  created_at: z.coerce.date(),
});

export type BasePageModel = z.infer<typeof BasePageModel>;

export function withBasePageModel<Incoming extends AnyZodObject>(
  page: Incoming
) {
  return BasePageModel.merge(page);
}

export const kYouTuBePages = {
  channel: 'channel',
  search: 'search',
  videos: 'videos',
  relation_channel: 'relation_channel',
  about: 'about',
  video: 'video',
} as const;

export type YouTuBePage = keyof typeof kYouTuBePages;

const YouTuBeChannelPageModel = z.object({
  channelId: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type YouTuBeChannelPageModel = z.infer<typeof YouTuBeChannelPageModel>;

const YouTuBeSearchChannel = z.object({
  category_name: z.string().nullish(),
  image: z.string().nullish(),
  name: z.string(),
  subscribers_count: z.string(),
  url: z.string(),
});
export type YouTuBeSearchChannel = z.infer<typeof YouTuBeSearchChannel>;

const YouTuBeSearchPageModel = withBasePageModel(
  z.object({
    channels: z.array(YouTuBeSearchChannel),
  })
);
export type YouTuBeSearchPageModel = z.infer<typeof YouTuBeSearchPageModel>;

const YouTuBeComment = z.object({
  content: z.string(),
  total_thumbs_up: z.string(),
  total_thumbs_down: z.string().nullish(),
  created_at: z.string(),
  user_avatar_image: z.string(),
  user_name: z.string(),
  user_link: z.string(),
});
export type YouTuBeComment = z.infer<typeof YouTuBeComment>;

const YouTuBeVideo = z.object({
  watchId: z.string(),
  video_title: z.string(),
  user_name: z.string(),
  user_link: z.string(),
  total_subscribers: z.string(),
  total_views: z.string(),
  publish_date: z.string(),
  total_comments: z.string(),
  total_thumbs_up: z.string(),
  total_thumbs_down: z.string().nullish(),
  video_detail: z.string(),
  comments: z.array(YouTuBeComment),
});
export type YouTuBeVideo = z.infer<typeof YouTuBeVideo>;

const YouTuBeVideosPageModel = withBasePageModel(
  z.object({
    channelId: z.string(),
    name: z.string(),
    subscribers_count: z.string(),
    videos: z.array(
      z.object({
        image: z.string(),
        title: z.string(),
        views: z.string(),
        publish_date: z.string(),
        url: z.string(),
      })
    ),
  })
);
export type YouTuBeVideosPageModel = z.infer<typeof YouTuBeVideosPageModel>;

const YouTuBeRelationChannelPageModel = withBasePageModel(
  z.object({
    channelId: z.string(),
    name: z.string(),
    subscribers_count: z.string(),
    relation_channels: z.array(YouTuBeSearchChannel),
  })
);
export type YouTuBeRelationChannelPageModel = z.infer<
  typeof YouTuBeRelationChannelPageModel
>;

const YouTuBeAboutPageModel = withBasePageModel(
  z.object({
    channelId: z.string(),
    name: z.string(),
    subscribers_count: z.string(),
    joinedAt: z.string(),
    views: z.string(),
    description: z.string(),
    detail_location: z.string(),
    links: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
      })
    ),
  })
);
export type YouTuBeAboutPageModel = z.infer<typeof YouTuBeAboutPageModel>;

const YouTuBeVideoPageModel = withBasePageModel(YouTuBeVideo);
export type YouTuBeVideoPageModel = z.infer<typeof YouTuBeVideoPageModel>;

export const YouTuBePageModels = z.object({
  channel: YouTuBeChannelPageModel,
  search: YouTuBeSearchPageModel,
  videos: YouTuBeVideosPageModel,
  relation_channel: YouTuBeRelationChannelPageModel,
  about: YouTuBeAboutPageModel,
  video: YouTuBeVideoPageModel,
});

export type YouTuBePageModels = z.infer<typeof YouTuBePageModels>;

const YouTuBeModelNameEnum = YouTuBePageModels.keyof();
export type YouTuBeModelName = z.infer<typeof YouTuBeModelNameEnum>;

export function getBigQuerySchemaByYouTuBe(name: YouTuBeModelName) {
  return convert(YouTuBePageModels.shape[name] as any);
}
