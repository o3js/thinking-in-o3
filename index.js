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
    filterText: o.observable('',
                             s.map(filterEvt, (e) => e.target.value)),
    inStockOnly: o.observable(false,
                              s.map(stockedEvt, (e) => e.target.checked)),
  };
};

const productTable = (products) => {
  const categoryRow = (cat) => [':tr', [':th', { colSpan: 2 }, cat]];

  const productRow = (product) => [
    ':tr',
    [':td',
     { style: product.stocked ? '' : 'color: red' },
     product.name],
    [':td', product.price],
  ];

  const rows = () =>
          _.reduce(products, (result, next, i) => {
            if (_.get(products[i - 1], 'category') !== next.category) {
              result.push(categoryRow(next.category));
            }
            result.push(productRow(next));
            return result;
          }, []);

  return [':table',
          [':thead',
           [':tr',
            [':th', 'Name'],
            [':th', 'Price']]],
          [':tbody', rows()]];
};

const filterProducts = (products, text, inStockOnly) =>
        _.filter(
          products,
          (p) => _.includes(p.name, text) && (!inStockOnly || p.stocked));

const search = searchBar();

const filteredProductsTable = [
  ':div',
  { style: 'padding: 20px' },
  search.content, // TODO: needs a better name than "content"
  o(productTable,
    o(filterProducts,
      PRODUCTS,
      search.filterText,
      search.inStockOnly)),
];

document
  .getElementById('container')
  .appendChild(dom.render(document, filteredProductsTable));
