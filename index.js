/* global document: true */
const fp = require('lodash/fp');
const dom = require('o3-dom');
const z = require('zoetic');

const PRODUCTS = [
  { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
  { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
  { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
  { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
  { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
  { category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7' },
];

function searchBar() {
  const filterEvt = z.emitter();
  const stockedEvt = z.emitter();
  return {
    content: [
      ':form',
      [':input', {
        type: 'text',
        placeholder: 'Search...',
        oninput: z.bind(filterEvt) }],
      [':p',
       [':input', {
         type: 'checkbox',
         onchange: z.bind(stockedEvt) }],
       ' ', 'Only show products in stock',
      ],
    ],

    filterText: z.observable(
      '',
      z.map((e) => e.target.value, filterEvt)),

    inStockOnly: z.observable(
      false,
      z.map((e) => e.target.checked, stockedEvt)),
  };
}

function productTable(products) {
  function categoryRow(cat) {
    return [':tr', [':th', { colSpan: 2 }, cat]];
  }

  function productRow(product) {
    return [
      ':tr',
      [':td',
       { style: product.stocked ? '' : 'color: red' },
       product.name],
      [':td', product.price],
    ];
  }

  function rows() {
    let prevCategory = null;
    return fp.reduce((result, next) => {
      if (prevCategory !== next.category) {
        result.push(categoryRow(next.category));
      }
      result.push(productRow(next));
      prevCategory = next.category;
      return result;
    }, [], products);
  }

  return [':table',
          [':thead',
           [':tr',
            [':th', 'Name'],
            [':th', 'Price']]],
          [':tbody', rows()]];
}

function filterProducts(products, text, inStockOnly) {
  return fp.filter(
    (p) => fp.includes(text, p.name) && (!inStockOnly || p.stocked),
    products);
}

const search = searchBar();

const filteredProductsTable = [
  ':div',
  { style: 'padding: 20px' },
  search.content, // TODO: needs a better name than "content"
  z.observe(
    productTable,
    z.observe(
      filterProducts,
      PRODUCTS,
      search.filterText,
      search.inStockOnly)
  ),
];

document
  .getElementById('container')
  .appendChild(dom.render(filteredProductsTable, document));
