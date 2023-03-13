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

export const kTikTokPages = {
  sitemap: 'sitemap',
  topic: 'topic',
  account: 'account',
  tag: 'tag',
} as const;

export type TikTokPage = keyof typeof kTikTokPages;

const TikTokSitemapTopic = z.object({
  topic: z.string(),
  url: z.string(),
});
export type TikTokSitemapTopic = z.infer<typeof TikTokSitemapTopic>;

const TikTokSitemapAccount = z.object({
  name: z.string(),
  url: z.string(),
});
export type TikTokSitemapAccount = z.infer<typeof TikTokSitemapAccount>;

const TikTokSitemapTag = z.object({
  tag: z.string(),
  url: z.string(),
});
export type TikTokSitemapTag = z.infer<typeof TikTokSitemapTag>;

const TikTokSitemapPageModel = withBasePageModel(
  z.object({
    topics: z.array(TikTokSitemapTopic),
    accounts: z.array(TikTokSitemapAccount),
    tags: z.array(TikTokSitemapTag),
  })
);
export type TikTokSitemapPageModel = z.infer<typeof TikTokSitemapPageModel>;

const TikTokVideo = z.object({
  author: z.string(),
  content: z.string(),
  music: z.object({ title: z.string(), url: z.string() }),
  player: z.object({ image_url: z.string(), video_url: z.string() }),
  stars: z.string(),
  comments: z.string(),
  shares: z.string().nullish(),
});

export type TikTokVideo = z.infer<typeof TikTokVideo>;

const TikTokVideoPageModel = withBasePageModel(
  z.object({
    data: z.array(TikTokVideo),
  })
);
export type TikTokVideoPageModel = z.infer<typeof TikTokVideoPageModel>;

// export const TikTokPageModels2 = {
//   sitemap: TikTokSitemapPageModel,
//   topic: TikTokVideoPageModel,
//   account: TikTokVideoPageModel,
//   tag: TikTokVideoPageModel,
// } as const;

// export type TikTokModelName = keyof typeof TikTokPageModels;

const TikTokPageModels = z.object({
  sitemap: TikTokSitemapPageModel,
  topic: TikTokVideoPageModel,
  account: TikTokVideoPageModel,
  tag: TikTokVideoPageModel,
});

export type TikTokPageModels = z.infer<typeof TikTokPageModels>;

const TikTokModelNameEnum = TikTokPageModels.keyof();

export type TikTokModelName = z.infer<typeof TikTokModelNameEnum>;

export function getBigQuerySchemaByTikTok(name: TikTokModelName) {
  // return convert(TikTokPageModels[name] as any);
  return convert(TikTokPageModels.shape[name] as any);
}
