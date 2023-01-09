import _ from "lodash";

/**
 *
 * @param categories
 * @returns {*[]|*}
 */
export const filter_parent_cats = (categories) => {
  if (!_.isEmpty(categories) && _.isArray(categories)) {
    return categories.filter((category) => category.ParentId === null);
  }
  return [];
};

/**
 *
 * @param categories
 * @param otc_id
 * @returns {*[]|*}
 */
export const filter_children_cats = (categories, otc_id) => {
  if (_.isArray(categories) && otc_id) {
    return categories.filter((filter) => filter.ParentId === otc_id);
  }
  return [];
};

/**
 *
 * @param categories
 * @param slug
 * @returns {{}|*}
 */
export const find_cat_by_slug = (categories, slug) => {
  if (!_.isEmpty(categories) && _.isArray(categories) && slug) {
    return categories.find((find) => find.slug === slug);
  }
  return {};
};
/**
 *
 * @param categories
 * @param parentId
 * @returns {{}|*}
 */
export const find_cat_parent = (categories, ParentId) => {
  if (!_.isEmpty(categories) && _.isArray(categories) && !_.isNaN(ParentId)) {
    return categories.find((find) => find.otc_id === ParentId);
  }
  return {};
};

/**
 *
 * @param asset
 * @returns {string|*}
 */
export const loadAsset = (asset) => {
  const asset_base_url = process.env.REACT_APP_ASSET_BASE_URL;
  if (asset_base_url) {
    return asset_base_url + "/" + asset;
  }
  return asset;
};

/**
 *
 * @param category
 * @returns {string|*}
 */
export const loadCatImg = (category) => {
  const asset_base_url = process.env.REACT_APP_ASSET_BASE_URL;
  if (!_.isEmpty(category)) {
    const picture = category.picture;
    if (picture) {
      return asset_base_url + "/" + picture;
    }
    const IconImageUrl = category.IconImageUrl;
    if (IconImageUrl) {
      return IconImageUrl;
    }
  }
  return asset_base_url + "/img/backend/no-image-300x300.png";
};

/**
 *
 * @param Pictures
 * @param mainPicture
 * @param size
 * @returns {string|*}
 */
export const loadProductImg = (
  Pictures,
  mainPicture = "/img/backend/no-image-300x300.png",
  size = "Medium"
) => {
  if (!_.isEmpty(Pictures) && _.isArray(Pictures)) {
    if (Pictures.length > 0) {
      const firstPicture = Pictures[0];
      if (!_.isEmpty(firstPicture)) {
        return firstPicture[size].Url;
      }
    }
  }
  return mainPicture;
};

/**
 *
 * @param slug
 * @returns {*}
 */
export const slugToKey = (slug) => {
  return _.camelCase(slug);
};

/**
 * @description go to page top
 */
export const goPageTop = () => {
  try {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  } catch (error) {
    window.scrollTo(0, 0);
  }
};

export const getSetting = (general, key, common = null) => {
  if (_.isObject(general) && !_.isEmpty(general)) {
    const returnKey = general[key];
    return !_.isNaN(returnKey) ? returnKey : common;
  }
  return common;
};

export const characterLimiter = (string, length = 42, separator = "...") => {
  return _.truncate(string, {
    length: length,
    separator: separator,
  });
};
