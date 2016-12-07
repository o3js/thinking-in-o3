/* global document: true */
const _ = require('lodash');
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

  const el = [
    ':form',
    [':input', {
      type: 'text',
      placeholder: 'Search...',
      mount: z.bindel('value', 'input', filterText),
    }],
    [':p',
     [':input',
      { type: 'checkbox',
        mount: z.bindel('checked', 'change', inStockOnly),
      }],
     ' ', 'Only show products in stock',
    ],
  ];

  return { el, filterText, inStockOnly };
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

function productRows(products) {
  let prevCategory = null;
  return _.reduce(products, (result, next) => {
    if (prevCategory !== next.category) {
      result.push(categoryRow(next.category));
    }
    result.push(productRow(next));
    prevCategory = next.category;
    return result;
  }, []);
}

function productTable(products, text, inStockOnly) {
  products = _.filter(
    products,
    (p) => _.includes(p.name, text) && (!inStockOnly || p.stocked));
  return [':table',
          [':thead',
           [':tr',
            [':th', 'Name'],
            [':th', 'Price']]],
          [':tbody', productRows(products)]];
}

const aSearchBar = searchBar();

const ui = [
  ':div',
  { style: 'padding: 20px' },
  aSearchBar.el,
  z.apply(
    productTable,
    PRODUCTS,
    aSearchBar.filterText,
    aSearchBar.inStockOnly),
];

document
  .getElementById('container')
  .appendChild(dom.render(ui, document));
