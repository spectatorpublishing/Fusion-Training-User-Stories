/*
*
*
*
THIS IS NOT A WORKING CONTENT SOURCE IN THIS REPO
BUT IT IS AN EXAMPLE OF HOW TO CREATE A FETCH CONTENT SOURCE
IN ORDER TO HIT ADDITIONAL ENDPOINTS IN ONE CONTENT SOURCE
*/


import request from 'request-promise-native';
import { CONTENT_BASE } from 'fusion:environment';
import { getRelatedContent } from '~/components/utilities/ans/ans-helper';
import ContentApiV4 from './content-api-v4';
import StoryIdsContentSource, { pattern } from './story-ids';

// use same outlines as CCs content-api-v4
const {
  params,
  resolve,
  schemaName,
  transform,
} = ContentApiV4;

const fetch = (query) => {
  // use same uri as CCs content-api-v4
  const optionsArticle = {
    uri: CONTENT_BASE + resolve(query),
    json: true,
  };

  return request(optionsArticle).then((articleJson) => {
    // fetch the story and extract the related content ids
    const ids = getRelatedContent(articleJson).map(({ _id, referent }) => {
      if (referent) {
        return referent.id;
      }
      return _id;
    });

    if (ids.length === 0) {
      return articleJson;
    }

    const uri = CONTENT_BASE + pattern({
      ...query,
      idList: ids,
    });

    return request({
      uri,
      json: true,
    }).then((relatedContentJson) => {
      // merge the relative content into the main story
      const relatedContents = relatedContentJson.content_elements;
      const article = articleJson;
      if (relatedContents.length > 0) {
        article.related_content.basic = articleJson.related_content.basic.map((refRelatedContent) => {
          const { transform: idsTransform } = StoryIdsContentSource;
          const fetchedRelatedContent = relatedContents.find(({ _id }) => {
            if (refRelatedContent.referent) {
              return _id === refRelatedContent.referent.id;
            }
            return _id === refRelatedContent._id;
          });
          // this horrid structure is needed to reuse the existing transform from other content-sources
          // in the end, it will be returned as the single object
          if (fetchedRelatedContent) {
            return idsTransform({
              content_elements: [fetchedRelatedContent],
            })[0];
          }
          return null;
        }).filter((potentiallyEmpty) => {
          return potentiallyEmpty != null;
        });
      }
      return article;
    }).catch(() => {
      console.warn('Error fetching related content. Related content was removed from story.');
      return {
        ...articleJson,
        related_content: {
          basic: [],
        },
      };
    });
  });
};

export default {
  fetch,
  params,
  schemaName,
  transform,
};
