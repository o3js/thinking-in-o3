/* global document: true */
const _ = require('lodash');
const dom = require('o3-dom');
const { s, o } = require('ex');

const PRODUCTS = [
  { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
  { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
  { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
  { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
  { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
  { category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7' },
];

const searchBar = () => {
  const filterEvt = s.stream();
  const stockedEvt = s.stream();
  return {
    content: [
      ':form',
      [':input', {
        type: 'text',
        placeholder: 'Search...',
        oninput: s.bind(filterEvt) }],
      [':p',
       [':input', {
         type: 'checkbox',
         onchange: s.bind(stockedEvt) }],
       ' ', 'Only show products in stock',
      ],
    ],
    filterText: o.observable('', s((e) => e.target.value, filterEvt)),
    inStockOnly: o.observable(false, s((e) => e.target.checked, stockedEvt)),
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


const search = searchBar();


dom.attach(
  document,
  '#container',
  [
    ':div',
    { style: 'padding: 20px' },
    search.content,
    o(productTable,
      o(_.filter,
       PRODUCTS,
        o((filterText, inStockOnly) =>
          (p) => _.includes(p.name, filterText) && (!inStockOnly || p.stocked),
          search.filterText,
          search.inStockOnly))),
  ]
);
