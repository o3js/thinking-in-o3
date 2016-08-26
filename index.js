/* global document: true */
const _ = require('lodash');
const dom = require('o3-dom');
const X = require('ex');

const searchBar = () => {
  const filterText = X.observable('');
  const inStockOnly = X.observable(false);
  return {
    content: [
      ':form',
      [':input', {
        type: 'text',
        placeholder: 'Search...',
        onChange: X.boundCallback(filterText) }],
      [':p',
       [':input', {
         type: 'checkbox',
         onChange: X.boundCallback(inStockOnly) }],
       ' ', 'Only show products in stock',
      ],
    ],
    filterText,
    inStockOnly,
  };
};

const categoryRow = (cat) => [':tr', [':th', { colSpan: 2 }, cat]];

const productRow = (product) => [
  ':tr',
  [':td',
   { style: product.stocked ? '' : 'color: red' },
   product.name],
  [':td', product.price],
];

const productTable = (products) => [
  ':table',
  [':thead',
   [':tr',
    [':th', 'Name'],
    [':th', 'Price']]],
  _.reduce(products, (result, next, i) => {
    if (_.get(products[i - 1], 'category') !== next.category) {
      result.push(categoryRow(next.category));
    }
    result.push(productRow(next));
    return result;
  }, []),
];

const filteredProducts = (products, filterText, inStockOnly) =>
        X.map(
          X.observeAll([filterText, inStockOnly]),
          ([ft, iso]) => _.filter(
            products,
            (p) => _.includes(p.name, ft) && (!iso || p.stocked)));

const PRODUCTS = [
  { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
  { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
  { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
  { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
  { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
  { category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7' },
];

const search = searchBar();

dom.attach(
  document,
  '#container',
  [
    ':div',
    { style: 'padding: 20px' },
    search.content,
    X.map(
      filteredProducts(PRODUCTS, search.filterText, search.inStockOnly),
      productTable),
  ]
);
