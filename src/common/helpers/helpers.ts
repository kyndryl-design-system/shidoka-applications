export const debounce = (fn: Function, ms = 100) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (e: Event) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(e), ms);
  };
};

export const stringToReactHtml = (string: String) => {
  return { __html: string };
};

/**
 * Convert an object to an array of only its values.
 * Used when importing enums in component stories for populating argType dropdowns.
 * @param {*} options
 *  imported enums object
 */
export function createOptionsArray(options: any = {}) {
  const optionsArray: any = [];

  Object.keys(options).map((key) => {
    optionsArray.push(options[key]);
  });

  return optionsArray;
}

/**
 * The function `filterLocalNavLinks` filters an array of navigation links based on a search term and
 * recursively filters sublinks.
 * @param linksArr - The `linksArr` parameter is an array of objects representing navigation links.
 * Each object in the array may contain sublinks, text content, and an expanded attribute.
 * @param {String} searchTerm - The `searchTerm` parameter is a string that represents the search term
 * or keyword that will be used to filter the navigation links. The function will filter out any
 * navigation links that do not match this search term.
 * @param [expandedAttr=expanded] - The `expandedAttr` parameter in the `filterLocalNavLinks` function
 * is used to specify the attribute name that determines whether a navigation link is expanded or not.
 * By default, the value of `expandedAttr` is set to 'expanded'. This attribute is used to control the
 * visibility of sublinks.
 * @param [sublinksAttr=links] - The `sublinksAttr` parameter in the `filterLocalNavLinks` function
 * refers to the attribute name that contains sublinks within each link object in the `linksArr` array.
 * This parameter allows the function to recursively filter through nested sublinks to find matches
 * based on the search term provided.
 * @param [textAttr=text] - The `textAttr` parameter in the `filterLocalNavLinks` function represents
 * the attribute name that holds the text content of each link in the `linksArr` array. This attribute
 * is used to check if the text content of a link includes the `searchTerm` provided for filtering
 * purposes.
 * @returns The `filterLocalNavLinks` function is returning an array of filtered navigation links based
 * on the search term provided. The function recursively filters through the array of links and their
 * sublinks to find matches with the search term. It returns an array of link objects that match the
 * search term or have sublinks that match the search term. If a link object has sublinks that match
 * the search term and the
 */
export const filterLocalNavLinks = (
  linksArr: Array<any>,
  searchTerm: String,
  expandedAttr = 'expanded',
  sublinksAttr = 'links',
  textAttr = 'text'
) => {
  return linksArr.reduce((result: Array<any>, link) => {
    // rescurse through links array subtree
    const Links = filterLocalNavLinks(
      link[sublinksAttr] || [],
      searchTerm,
      expandedAttr,
      sublinksAttr,
      textAttr
    );

    // check for links that match searchTerm
    if (
      link[textAttr].toLowerCase().includes(searchTerm.toLowerCase()) ||
      Links.length
    ) {
      // generate new link object
      const LinkObj = Object.assign({}, link);

      // add sublinks to link object if present
      if (Links.length) {
        LinkObj[sublinksAttr] = Links;
      }

      // expand sub-menus on larger screens if present
      if (
        window.innerWidth >= 672 &&
        LinkObj[sublinksAttr] &&
        LinkObj[sublinksAttr].length &&
        searchTerm !== ''
      ) {
        LinkObj[expandedAttr] = true;
      }

      // add link object to final result
      result.push(LinkObj);
    }

    return result;
  }, []);
};
