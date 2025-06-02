/*eslint-disable*/
import React, { useState, useEffect } from "react";
import Head from "next/head";
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
import Tooltip from "@mui/material/Tooltip";
import Favorite from "@mui/icons-material/Favorite";
import Close from "@mui/icons-material/Close";
import Remove from "@mui/icons-material/Remove";
import Add from "@mui/icons-material/Add";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Home from "@mui/icons-material/Home";
import LocationCity from "@mui/icons-material/LocationCity";
import PinDrop from "@mui/icons-material/PinDrop";
import PublicOutlined from "@mui/icons-material/PublicOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Error from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Table from "/components/Table/Table.js";
import Button from "/components/CustomButtons/Button.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import CustomDropdown from "/components/CustomDropdown/CustomDropdown.js";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, PublicKey } from '@solana/web3.js';
import { collection, query, getDocs, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import shoppingCartStyle from "/styles/jss/nextjs-material-kit-pro/pages/shoppingCartStyle.js";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  ...shoppingCartStyle,
  shippingInput: {
    "& input": {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '14px',
      color: '#212121',
      padding: '10px',
      '&:hover': {
        boxShadow: 'none',
      },
      '&:focus': {
        boxShadow: 'none',
        outline: 'none',
      },
    },
    "& label": {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '14px',
      color: '#4d455d',
    },
    marginBottom: '15px',
  },
  shippingTotal: {
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    color: '#212121',
    textAlign: 'right',
    margin: '10px 0',
  },
  formContainer: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  tablePurchase: {
    '& td': {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '16px',
      fontWeight: 500,
      color: '#212121',
    },
  },
  paymentDropdown: {
    marginTop: '20px',
    marginBottom: '10px',
    width: '100%',
    textAlign: 'left',
    '@media (min-width: 960px)': {
      '& button': {
        padding: '12px 30px',
        fontSize: '18px',
        lineHeight: '1.5em',
        minWidth: '200px',
        width: '200px',
        borderRadius: '30px',
      },
      '& .MuiMenu-paper': {
        width: '200px',
        '& .MuiMenuItem-root': {
          fontSize: '16px',
          padding: '10px 20px',
          justifyContent: 'center',
        },
      },
    },
    '@media (max-width: 959px)': {
      '& button': {
        width: '100%',
        padding: '12px 20px',
        fontSize: '16px',
        borderRadius: '30px',
      },
      '& .MuiMenu-paper': {
        width: '100%',
        '& .MuiMenuItem-root': {
          fontSize: '14px',
          padding: '10px 20px',
          justifyContent: 'center',
        },
      },
    },
  },
  completePurchaseButton: {
    marginTop: '20px',
    width: '100%',
    textAlign: 'left',
    '@media (min-width: 960px)': {
      '& button': {
        padding: '12px 30px',
        fontSize: '18px',
        lineHeight: '1.5em',
        minWidth: '200px',
        width: '200px',
        borderRadius: '30px',
      },
    },
    '@media (max-width: 959px)': {
      '& button': {
        width: '100%',
        padding: '12px 20px',
        fontSize: '16px',
        borderRadius: '30px',
      },
    },
  },
  checkoutPopup: {
    textAlign: 'center',
    padding: '20px',
  },
  checkoutIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  successIcon: {
    color: '#6fcba9',
  },
  errorIcon: {
    color: '#e57373',
  },
  checkoutMessage: {
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '18px',
    marginBottom: '20px',
  },
});

export default function ShoppingCartPage({ solPrice: initialSolPrice, flash: initialFlash }) {
  const classes = useStyles();
  const { connected, publicKey, signTransaction } = useWallet();
  const router = useRouter();
  const [walletId, setWalletId] = useState(null);
  const [isConnected, setIsConnected] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [hasRWI, setHasRWI] = useState(false);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [totalShipping, setTotalShipping] = useState(0);
  const [solPrice, setSolPrice] = useState(initialSolPrice);
  const [flash, setFlash] = useState(initialFlash);
  const [paymentCurrency, setPaymentCurrency] = useState('SOL');
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setIsConnected(connected);
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      setWalletId(walletAddress);
      console.log("Wallet ID:", walletAddress);
      fetchCartItems(walletAddress);
    } else {
      setWalletId(null);
      setCartItems([]);
      setTotalShipping(0);
      setHasRWI(false);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 && shippingAddress.zip && shippingAddress.country && hasRWI) {
      calculateShippingCosts();
    } else {
      setTotalShipping(0);
    }
  }, [cartItems, shippingAddress, hasRWI]);

  useEffect(() => {
    const updatePrice = async () => {
      try {
        const response = await fetch('/api/solPrice');
        const data = await response.json();
        setSolPrice(data.solana.usd);
        console.log('Client-side SOL price update:', data.solana.usd);
        setFlash(true);
        setTimeout(() => setFlash(false), 800);
      } catch (error) {
        console.error('Error updating SOL price client-side:', error);
      }
    };

    updatePrice();
    const interval = setInterval(updatePrice, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchCartItems = async (walletId) => {
    try {
      const cartRef = collection(db, `users/${walletId}/cart`);
      const cartQuery = query(cartRef);
      const cartSnapshot = await getDocs(cartQuery);
      console.log("Cart items found:", cartSnapshot.docs.length);
      const items = await Promise.all(cartSnapshot.docs.map(async (docSnap) => {
        const itemData = docSnap.data();
        const productRef = doc(db, "products", itemData.productId);
        const productDoc = await getDoc(productRef);
        const type = productDoc.exists() ? productDoc.data().type : 'digital';
        return { id: docSnap.id, ...itemData, type };
      }));
      setCartItems(items);
      console.log("Cart items:", items);
      setHasRWI(items.some(item => item.type === "rwi"));
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError(`Failed to load cart: ${err.message}`);
    }
  };

  const calculateShippingCosts = async () => {
    let shippingTotal = 0;
    for (const item of cartItems) {
      try {
        if (item.type !== "rwi") continue;
        const isDomestic = shippingAddress.country.toLowerCase().includes('united states') || shippingAddress.country.toLowerCase() === 'us';
        const itemShipping = isDomestic ? 14 : 40;
        shippingTotal += itemShipping * item.quantity;
      } catch (err) {
        console.error(`Error calculating shipping for item ${item.id}:`, err);
      }
    }
    setTotalShipping(shippingTotal);
  };

  const handleShippingChange = (field) => (event) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleQuantityChange = async (itemId, delta) => {
    try {
      const item = cartItems.find(item => item.id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);
      if (delta > 0) {
        const productRef = doc(db, "products", item.productId);
        const productDoc = await getDoc(productRef);
        if (!productDoc.exists()) {
          console.warn(`Product ${item.productId} not found`);
          return;
        }
        const productData = productDoc.data();

        let availableQuantity = 0;
        if (productData.type === "digital") {
          availableQuantity = productData.quantity || 0;
        } else if (productData.type === "rwi") {
          const variant = productData.variants?.find(v => v.size === item.size && v.color === item.color);
          availableQuantity = variant ? parseInt(v.quantity) || 0 : 0;
        }

        if (newQuantity > availableQuantity) {
          console.log(`Cannot add more of ${item.name}. Only ${availableQuantity} units available.`);
          return;
        }
      }

      const cartRef = doc(db, `users/${walletId}/cart`, itemId);
      await setDoc(cartRef, { quantity: newQuantity, walletId }, { merge: true });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      console.log("Updated quantity for item:", itemId, newQuantity);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(`Failed to update quantity: ${err.message}`);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const cartRef = doc(db, `users/${walletId}/cart`, itemId);
      await deleteDoc(cartRef);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      console.log("Removed item from cart:", itemId);
      setHasRWI(cartItems.filter(item => item.id !== itemId).some(item => item.type === "rwi"));
    } catch (err) {
      console.error("Error removing item:", err);
      setError(`Failed to remove item: ${err.message}`);
    }
  };

  const handleCheckout = async () => {
    if (!connected || !walletId || !publicKey || !signTransaction) {
      setCheckoutStatus('error');
      setCheckoutMessage("Please connect your wallet to proceed.");
      return;
    }

    if (hasRWI && (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zip || !shippingAddress.country)) {
      setCheckoutStatus('error');
      setCheckoutMessage("Please provide a complete shipping address for physical items.");
      return;
    }

    setProcessing(true);
    try {
      const grandTotal = totalAmount + totalShipping;
      const checkoutData = {
        walletId,
        cartItems: cartItems.map(item => ({
          id: item.id,
          productId: item.productId,
          storeId: item.storeId,
          sellerId: item.sellerId,
          name: item.name,
          priceUsdc: item.priceUsdc,
          quantity: item.quantity,
          quantities: Array(item.quantity).fill(1),
          type: item.type,
          size: item.size || null,
          color: item.color || null,
          imageUrl: item.imageUrl,
          nftId: item.type === 'rwi' ? `${item.productId}-${item.size}-${item.color}-1` : null,
        })),
        shippingAddress: hasRWI ? shippingAddress : {},
        currency: paymentCurrency,
        f4cetWallet: '2Wij9XGAEpXeTfDN4KB1ryrizicVkUHE1K5dFqMucy53',
        solPrice,
        grandTotal,
        step: 'payment',
      };
      console.log("Checkout payment data:", JSON.stringify(checkoutData, null, 2));

      // Step 1: Process payment
      let paymentResponse = await fetch('https://process-cnft-checkout-232592911911.us-central1.run.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });
      let paymentResult = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Log seller discounts
      if (paymentResult.sellerFees) {
        paymentResult.sellerFees.forEach(fee => {
          if (fee.discount === 0.5) {
            console.log(`Seller ${fee.sellerId} Discount Applied: 2% F4cets Fee`);
          } else if (fee.discount === 0.25) {
            console.log(`Seller ${fee.sellerId} Discount Applied: 3% F4cets Fee`);
          } else {
            console.log(`Seller ${fee.sellerId}: No Discount, 4% F4cets Fee`);
          }
        });
      }

      // Sign and send payment transaction
      const { transaction, lastValidBlockHeight } = paymentResult;
      const connection = new Connection(process.env.NEXT_PUBLIC_QUICKNODE_RPC || 'https://maximum-delicate-butterfly.solana-mainnet.quiknode.pro/0d01db8053770d711e1250f720db6ffe7b81956c/', 'confirmed');
      let tx;
      try {
        tx = Transaction.from(Buffer.from(transaction, 'base64'));
      } catch (err) {
        console.error('Failed to parse payment transaction:', err);
        throw new Error('Invalid payment transaction data');
      }
      const signedTx = await signTransaction(tx);
      const paymentSignature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction({ signature: paymentSignature, lastValidBlockHeight }, 'confirmed');
      console.log("Payment transaction confirmed:", paymentSignature);

      // Step 2: Process cNFT transfers
      checkoutData.step = 'transfer';
      checkoutData.paymentSignature = paymentSignature;
      console.log("Checkout transfer data:", JSON.stringify(checkoutData, null, 2));

      let transferResponse = await fetch('https://process-cnft-checkout-232592911911.us-central1.run.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });
      let transferResult = await transferResponse.json();
      if (!transferResponse.ok) {
        throw new Error(transferResult.error || 'cNFT transfer failed');
      }

      setCartItems([]);
      setTotalShipping(0);
      setHasRWI(false);
      setCheckoutStatus('success');
      setCheckoutMessage('Checkout completed successfully!');
      setTransactionId(transferResult.transactionIds && transferResult.transactionIds.length > 0 ? transferResult.transactionIds[0] : null);
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutStatus('error');
      setCheckoutMessage(`Checkout failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSelect = (currency) => {
    setPaymentCurrency(currency);
  };

  const handleClosePopup = () => {
    setCheckoutStatus(null);
    setCheckoutMessage('');
    setTransactionId(null);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.priceUsdc * item.quantity,
    0
  );
  const grandTotal = totalAmount + totalShipping;
  const grandTotalSol = solPrice ? (grandTotal / solPrice).toFixed(4) : 'N/A';

  const tableData = cartItems.map((item) => [
    <div className={classes.imgContainer} key={item.id}>
      <img src={item.imageUrl} alt={item.name} className={classes.img} />
    </div>,
    <span key={item.id}>
      <a href={`/products/${item.productId}`} className={classes.tdNameAnchor}>
        {item.name}
      </a>
    </span>,
    item.color || "N/A",
    item.size || "N/A",
    <span key={item.id}>
      <small>$</small> {item.priceUsdc.toLocaleString()}
    </span>,
    <span key={item.id}>
      <div className={classes.buttonGroup}>
        <Button
          color="rose"
          size="sm"
          round
          onClick={() => handleQuantityChange(item.id, -1)}
        >
          <Remove />
        </Button>
        <span className={classes.quantityNumber}>{item.quantity}</span>
        <Button
          color="rose"
          size="sm"
          round
          onClick={() => handleQuantityChange(item.id, 1)}
        >
          <Add />
        </Button>
      </div>
    </span>,
    <span key={item.id}>
      <small>$</small> {(item.priceUsdc * item.quantity).toLocaleString()}
    </span>,
    <Tooltip
      key={item.id}
      id={`close-${item.id}`}
      title="Remove item"
      placement="left"
      classes={{ tooltip: classes.tooltip }}
    >
      <Button link className={classes.removeButton} onClick={() => handleRemoveItem(item.id)}>
        <Close />
      </Button>
    </Tooltip>
  ]).concat([
    {
      purchase: true,
      colspan: "3",
      col: {
        colspan: 3,
        text: (
          <>
            <div className={classes.shippingTotal}>
              Items Total: <small>$</small> {totalAmount.toLocaleString()}
            </div>
            <div className={classes.shippingTotal}>
              Estimated Shipping: <small>$</small> {totalShipping.toLocaleString()}
            </div>
            <div className={classes.shippingTotal}>
              Grand Total: <small>$</small> {grandTotal.toLocaleString()} <motion.span
                animate={flash ? { scale: [1, 1.3, 1], color: ['#555', '#6FCBA9', '#555'] } : {}}
                transition={{ duration: 0.8 }}
              >
                ({grandTotalSol} SOL)
              </motion.span>
            </div>
            {hasRWI && (
              <GridContainer className={classes.formContainer} spacing={2}>
                <GridItem xs={12} sm={6}>
                  <CustomInput
                    labelText="Street Address"
                    id="street"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.shippingInput,
                    }}
                    inputProps={{
                      value: shippingAddress.street,
                      onChange: handleShippingChange('street'),
                      startAdornment: <Home style={{ color: '#4d455d' }} />,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={6}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.shippingInput,
                    }}
                    inputProps={{
                      value: shippingAddress.city,
                      onChange: handleShippingChange('city'),
                      startAdornment: <LocationCity style={{ color: '#4d455d' }} />,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={6}>
                  <CustomInput
                    labelText="State/Province"
                    id="state"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.shippingInput,
                    }}
                    inputProps={{
                      value: shippingAddress.state,
                      onChange: handleShippingChange('state'),
                      startAdornment: <PinDrop style={{ color: '#4d455d' }} />,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={6}>
                  <CustomInput
                    labelText="ZIP/Postal Code"
                    id="zip"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.shippingInput,
                    }}
                    inputProps={{
                      value: shippingAddress.zip,
                      onChange: handleShippingChange('zip'),
                      startAdornment: <PinDrop style={{ color: '#4d455d' }} />,
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <CustomInput
                    labelText="Country"
                    id="country"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.shippingInput,
                    }}
                    inputProps={{
                      value: shippingAddress.country,
                      onChange: handleShippingChange('country'),
                      startAdornment: <PublicOutlined style={{ color: '#4d455d' }} />,
                    }}
                  />
                </GridItem>
              </GridContainer>
            )}
            <GridContainer className={classes.formContainer} spacing={2}>
              <GridItem xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <CustomDropdown
                  buttonText={`Pay with ${paymentCurrency}`}
                  buttonProps={{
                    color: "rose",
                    round: true,
                    className: classes.paymentDropdown
                  }}
                  dropdownList={["USDC", "SOL"]}
                  onClick={handlePaymentSelect}
                />
              </GridItem>
              <GridItem xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button 
                  color="rose" 
                  round 
                  className={classes.completePurchaseButton}
                  onClick={handleCheckout}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Complete Purchase"} <KeyboardArrowRight />
                </Button>
              </GridItem>
            </GridContainer>
          </>
        )
      }
    }
  ]);

  const mobileCartView = cartItems.map((item) => (
    <div className={classes.mobileCard} key={item.id}>
      <img src={item.imageUrl} alt={item.name} className={classes.mobileImg} />
      <div className={classes.mobileDetails}>
        <a href={`/products/${item.productId}`} className={classes.tdNameAnchor}>
          {item.name}
        </a>
        <p>Color: {item.color || "N/A"}</p>
        <p>Size: {item.size || "N/A"}</p>
        <p>Price: <small>$</small> {item.priceUsdc.toLocaleString()}</p>
        <div className={classes.mobileButtonGroup}>
          <Button
            color="rose"
            size="sm"
            round
            onClick={() => handleQuantityChange(item.id, -1)}
          >
            <Remove />
          </Button>
          <span className={classes.quantityNumber}>{item.quantity}</span>
          <Button
            color="rose"
            size="sm"
            round
            onClick={() => handleQuantityChange(item.id, 1)}
          >
            <Add />
          </Button>
        </div>
        <p>Amount: <small>$</small> {(item.priceUsdc * item.quantity).toLocaleString()}</p>
        <div className={classes.removeButtonContainer}>
          <Button link className={classes.removeButton} onClick={() => handleRemoveItem(item.id)}>
            <Close />
          </Button>
        </div>
      </div>
    </div>
  ));

  const mobileShippingForm = hasRWI ? (
    <GridContainer className={classes.formContainer} spacing={2}>
      <GridItem xs={12}>
        <CustomInput
          labelText="Street Address"
          id="street"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.street,
            onChange: handleShippingChange('street'),
            startAdornment: <Home style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CustomInput
          labelText="City"
          id="city"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.city,
            onChange: handleShippingChange('city'),
            startAdornment: <LocationCity style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CustomInput
          labelText="State/Province"
          id="state"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.state,
            onChange: handleShippingChange('state'),
            startAdornment: <PinDrop style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CustomInput
          labelText="ZIP/Postal Code"
          id="zip"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.zip,
            onChange: handleShippingChange('zip'),
            startAdornment: <PinDrop style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CustomInput
          labelText="Country"
          id="country"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.country,
            onChange: handleShippingChange('country'),
            startAdornment: <PublicOutlined style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <CustomDropdown
          buttonText={`Pay with ${paymentCurrency}`}
          buttonProps={{
            color: "rose",
            round: true,
            className: classes.paymentDropdown
          }}
          dropdownList={["USDC", "SOL"]}
          onClick={handlePaymentSelect}
        />
      </GridItem>
      <GridItem xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button 
          color="rose" 
          round 
          className={classes.completePurchaseButton}
          onClick={handleCheckout}
          disabled={processing}
        >
          {processing ? "Processing..." : "Complete Purchase"} <KeyboardArrowRight />
        </Button>
      </GridItem>
    </GridContainer>
  ) : (
    <GridContainer className={classes.formContainer} spacing={2}>
      <GridItem xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <CustomDropdown
          buttonText={`Pay with ${paymentCurrency}`}
          buttonProps={{
            color: "rose",
            round: true,
            className: classes.paymentDropdown
          }}
          dropdownList={["USDC", "SOL"]}
          onClick={handlePaymentSelect}
        />
      </GridItem>
      <GridItem xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button 
          color="rose" 
          round 
          className={classes.completePurchaseButton}
          onClick={handleCheckout}
          disabled={processing}
        >
          {processing ? "Processing..." : "Complete Purchase"} <KeyboardArrowRight />
        </Button>
      </GridItem>
    </GridContainer>
  );

  const logoVariants = {
    rest: { scale: 1, rotate: 0, transition: { duration: 0.3 } },
    hover: {
      scale: 1.1,
      rotate: [0, 5, -5, 5, 0],
      transition: { scale: { duration: 0.2 }, rotate: { repeat: 1, duration: 0.5 } },
    },
  };

  const successAnimation = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const errorAnimation = {
    initial: { opacity: 0, x: 0 },
    animate: {
      opacity: 1,
      x: [0, -10, 10, -10, 0],
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header
        brand="F4cets Marketplace"
        links={<HeaderLinks dropdownHoverColor="rose" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 300,
          color: "dark"
        }}
      />
      <Parallax image="/img/nextjs_header.jpg" filter="dark" className={classes.parallaxSmall}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              sm={8}
              className={classNames(classes.mlAuto, classes.mrAuto, classes.textCenter)}
            >
              <h2 className={classes.title}>Shopping Cart</h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <Card plain>
            <CardBody plain>
              <h3 className={classes.cardTitle}>Shopping Cart</h3>
              {error && !checkoutStatus ? (
                <div className={classes.textCenter}>
                  <h4>Error: {error}</h4>
                </div>
              ) : isConnected === null ? (
                <div className={classes.textCenter}>
                  <h4>Loading...</h4>
                </div>
              ) : isConnected ? (
                cartItems.length > 0 ? (
                  <>
                    <div className={classes.desktopView}>
                      <Table
                        tableHead={["", "PRODUCT", "COLOR", "SIZE", "PRICE", "QTY", "AMOUNT", ""]}
                        tableData={tableData}
                        tableShopping
                        customHeadCellClasses={[
                          classes.textCenter,
                          classes.description,
                          classes.description,
                          classes.textRight,
                          classes.textRight,
                          classes.textRight
                        ]}
                        customHeadClassesForCells={[0, 2, 3, 4, 5, 6]}
                        customCellClasses={[
                          classes.tdName,
                          classes.customFont,
                          classes.customFont,
                          classes.tdNumber,
                          classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                          classes.tdNumber + " " + classes.textCenter
                        ]}
                        customClassesForCells={[1, 2, 3, 4, 5, 6]}
                      />
                    </div>
                    <div className={classes.mobileView}>
                      {mobileCartView}
                      <div className={classes.mobileTotal}>
                        Items Total: <small>$</small> {totalAmount.toLocaleString()}
                      </div>
                      <div className={classes.mobileTotal}>
                        Estimated Shipping: <small>$</small> {totalShipping.toLocaleString()}
                      </div>
                      <div className={classes.mobileTotal}>
                        Grand Total: <small>$</small> {grandTotal.toLocaleString()} <motion.span
                          animate={flash ? { scale: [1, 1.3, 1], color: ['#555', '#6FCBA9', '#555'] } : {}}
                          transition={{ duration: 0.8 }}
                        >
                          ({grandTotalSol} SOL)
                        </motion.span>
                      </div>
                      {mobileShippingForm}
                    </div>
                  </>
                ) : (
                  <div className={classes.textCenter}>
                    <h4>Your cart is empty.</h4>
                  </div>
                )
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#212121" }}>
                  <h1
                    style={{
                      fontSize: { xs: "1.5rem", md: "2.5rem" },
                      fontWeight: "bold",
                      marginBottom: "40px",
                      lineHeight: "1.2",
                    }}
                  >
                    Connect Your Wallet to View Your Cart
                  </h1>
                  <GridContainer spacing={3} justifyContent="center">
                    <GridItem xs={12}>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "30px 30px 0 30px",
                          borderRadius: "15px",
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                          textAlign: "center",
                          marginBottom: "30px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: { xs: "1.5rem", md: "3rem" },
                            marginBottom: "15px",
                          }}
                        >
                          New to Solana or Crypto?
                        </h3>
                        <h4
                          style={{
                            fontSize: { xs: "1.5rem", md: "3.75rem" },
                            marginBottom: "20px",
                          }}
                        >
                          Download
                        </h4>
                        <motion.div
                          variants={logoVariants}
                          initial="rest"
                          whileHover="hover"
                        >
                          <a
                            href="https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src="/img/solflare-logo.png"
                              alt="Solflare Logo"
                              style={{
                                width: "100%",
                                maxWidth: "50%",
                                height: "auto",
                                marginBottom: "20px",
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            />
                          </a>
                        </motion.div>
                        <h2
                          style={{
                            fontSize: { xs: "1.25rem", md: "2.5rem" },
                            marginBottom: "20px",
                          }}
                        >
                          Preferred F4cet Marketplace Wallet
                        </h2>
                        <img
                          src="/img/solflare-m.png"
                          alt="Solflare QR Code"
                          style={{
                            width: "100%",
                            maxWidth: "150px",
                            height: "auto",
                            marginBottom: "20px",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                        <img
                          src="/img/solflareH.png"
                          alt="Solflare Hand"
                          style={{
                            width: "100%",
                            maxWidth: "60%",
                            height: "auto",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                      </div>
                    </GridItem>
                    <GridItem xs={12}>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "30px",
                          borderRadius: "15px",
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                          textAlign: "center",
                          marginBottom: "30px",
                        }}
                      >
                        <a
                          href="https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/img/solflareD.png"
                            alt="Solflare Extension"
                            style={{
                              width: "100%",
                              maxWidth: "70%",
                              height: "auto",
                              display: "block",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          />
                        </a>
                      </div>
                    </GridItem>
                  </GridContainer>
                </div>
              )}
              <Dialog
                open={checkoutStatus !== null}
                onClose={handleClosePopup}
                classes={{ paper: classes.checkoutPopup }}
              >
                <DialogTitle>
                  {checkoutStatus === 'success' ? (
                    <motion.div {...successAnimation}>
                      <CheckCircle className={`${classes.checkoutIcon} ${classes.successIcon}`} />
                    </motion.div>
                  ) : (
                    <motion.div {...errorAnimation}>
                      <Error className={`${classes.checkoutIcon} ${classes.errorIcon}`} />
                    </motion.div>
                  )}
                </DialogTitle>
                <DialogContent>
                  <div className={classes.checkoutMessage}>
                    {checkoutMessage}
                  </div>
                  {checkoutStatus === 'success' && transactionId && (
                    <div className={classes.checkoutMessage}>
                      Review your transaction and confirmation at:
                      <br />
                      <a
                        href={`https://user.f4cets.market/dashboards/buyer/marketplace/details/${transactionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#6fcba9', textDecoration: 'underline' }}
                      >
                        user.f4cets.market
                      </a>
                    </div>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosePopup} color="rose" round>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column' }}
                open={processing}
              >
                <CircularProgress color="inherit" size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Processing Checkout, please wait...
                </Typography>
              </Backdrop>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { fetchSolPrice } = require('../lib/getSolPrice');
  try {
    const solPrice = await fetchSolPrice();
    const now = Date.now();
    const flash = (now % 15000) < 500;
    return {
      props: {
        solPrice: solPrice || 200,
        flash,
      },
    };
  } catch (error) {
    console.error('Error fetching SOL price in getServerSideProps:', error);
    return {
      props: {
        solPrice: 200,
        flash: false,
      },
    };
  }
}