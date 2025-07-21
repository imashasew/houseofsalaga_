/* src/data/mockOrders.js */

//import { colours } from "nodemon/lib/config/defaults";
import classicTop      from "../images/op1.png";
import blackPant       from "../images/black-pant.png";


const orders = [
  {
    id: '123456789',
    date: '25 jan 2025',
    
    deliveryDate: '28 jan 2025',
    
    productName: 'Classic Top',
    image:classicTop,
    size: 'Samll',
    color:'Blue',
    qty: 4,
    price: 2500,
    status: 'In Process',
    message: 'Your product has been Inprocess',
  },
  {
    id: '76432ABC',
    date: '2025-01-20',
    deliveryDate: '2025-01-23',
     productName: 'Classic Top',
   image:classicTop,
    size: 'Small',
    color:'Blue',
    qty: 1,
    price: 2500,
    status: 'Completed',
    message: 'Your product has been Completed',
  },
  {
    id: '45323LMN',
    date: '2025-01-15',
    deliveryDate: '2025-01-18',
     productName: 'Classic Top',
    image:classicTop,
    size: 'Samll',
    color:'Blue',
    qty: 1,
    price: 2500,
    status: 'Cancelled',
    message: 'Your product has been Cancelled',
  },

  {
    id: '99999',
    date: '25 jan 2025',
    
    deliveryDate: '28 jan 2025',
    
    productName: 'Classic Top',
    image:classicTop,
    size: 'Samll',
    color:'Blue',
    qty: 1,
    price: 12500,
    status: 'In Process',
    message: 'Your product has been Inprocess',
  },

  {
    id: '12',
    date: '25 jan 2025',
    
    deliveryDate: '28 jan 2025',
    
    productName: 'Classic Top',
    image:classicTop,
    size: 'Samll',
    color:'Blue',
    qty: 1,
    price: 25000,
    status: 'In Process',
    message: 'Your product has been Inprocess',
  },

 {
    id: '45678',
    date: '10 june 2025',
    
    deliveryDate: '15 june 2025',
    
    productName: 'Black Pant',
    image:blackPant,
    size: 'Medium',
    color:'Black',
    qty: 1,
    price: 7850,
    status: 'Completed',
    message: 'Your product has been Completed',
  },
{
    id: '435678',
    date: '12 june 2025',
    
    deliveryDate: '15 june 2025',
    
    productName: 'Black Pant',
    image:blackPant,
    size: 'Medium',
    color:'Black',
    qty: 1,
    price: 7850,
    status: 'Cancelled',
    message: 'Your product has been Completed',
  },

  
];

export default orders;
