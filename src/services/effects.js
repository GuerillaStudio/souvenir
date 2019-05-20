export const boomerang = xs => [...xs, ...xs.slice(1, xs.length - 1).reverse()]
