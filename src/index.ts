import { Hono } from 'hono'
import { userController } from './controller/user-controller'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'
import { categoryController } from './controller/category-controller'
import { productController } from './controller/product-controller'
import { paymentMethodController } from './controller/payment-method-controller'
import { transactionController } from './controller/transaction-controller'
import { detailTransactionController } from './controller/detail-transaction-controller'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/users', userController)
app.route('/api/categories', categoryController)
app.route('/api/products', productController)
app.route('/api/payment-methods', paymentMethodController)
app.route('/api/transactions', transactionController)
app.route('/api/transaction-details', detailTransactionController)

app.onError( async (err, c) => {
  if (err instanceof HTTPException){
    c.status(err.status)
    return c.json({
      success: false,
      message: err.message,
    })
  } else if (err instanceof ZodError) {
    c.status(400)
    return c.json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => e.message),
    })
  } else {
    c.status(500)
    return c.json({
      success: false,
      message: 'Internal server error',
    })
  }
})

export default app
