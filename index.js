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
  const filterText = z.emitter();
  const inStockOnly = z.emitter();

  const element = [
    ':form',
    [':input', {
      type: 'text',
      placeholder: 'Search...',
      mount: z.observel('value', 'input', filterText),
    }],
    [':p',
     [':input',
      { type: 'checkbox',
        mount: z.observel('checked', 'change', inStockOnly),
      }],
     ' ', 'Only show products in stock',
    ],
  ];
  return {
    element,
    filterText,
    inStockOnly,
  };
}

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

function productTableRows(products) {
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

function productTable(products) {
  return [':table',
          [':thead',
           [':tr',
            [':th', 'Name'],
            [':th', 'Price']]],
          [':tbody', productTableRows(products)]];
}

function filterProducts(products, text, inStockOnly) {
  return fp.filter(
    (p) => fp.includes(text, p.name) && (!inStockOnly || p.stocked),
    products);
}

const aSearchBar = searchBar();

const filteredProductsTable = [
  ':div',
  { style: 'padding: 20px' },
  aSearchBar.element,
  z.emitify(productTable)(
    z.emitify(filterProducts)(
      PRODUCTS,
      aSearchBar.filterText,
      aSearchBar.inStockOnly)
  ),
];

document
  .getElementById('container')
  .appendChild(dom.render(filteredProductsTable, document));
