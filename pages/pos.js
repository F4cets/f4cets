/*eslint-disable*/
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import makeStyles from "@mui/styles/makeStyles";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Parallax from "/components/Parallax/Parallax.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import Button from "/components/CustomButtons/Button.js";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/ecommerceStyle.js";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from "/contexts/UserContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Connection, PublicKey, TransactionSignature } from "@solana/web3.js";
import { useEnv } from '/contexts/EnvContext'; // Assuming EnvContext for NEXT_PUBLIC_QUICKNODE_RPC

const useStyles = makeStyles({
  ...styles,
  posContainer: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
  },
  productGrid: {
    flex: 2,
    paddingRight: "16px",
  },
  checkoutSummary: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "8px",
    height: "fit-content",
  },
  card: {
    marginBottom: "16px",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    },
  },
  textCenter: {
    textAlign: "center",
  },
  variantSelector: {
    minWidth: "200px",
  },
  qrCode: {
    marginTop: "16px",
    textAlign: "center",
  },
});

const F4CETS_WALLET = "2Wij9XGAEpXeTfDN4KB1ryrizicVkUHE1K5dFqMucy53";
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SPLIT_PAYMENT_URL = "https://processpospayment-232592911911.us-central1.run.app/split";

export default function Pos() {
  const classes = useStyles();
  const { publicKey, disconnect } = useWallet();
  const { user } = useUser();
  const walletId = publicKey?.toBase58();
  const { env } = useEnv(); // Access NEXT_PUBLIC_QUICKNODE_RPC from EnvContext
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [storeId, setStoreId] = useState(null);
  const [error, setError] = useState(null);
  const [solPrice, setSolPrice] = useState(200);
  const [paymentCurrency, setPaymentCurrency] = useState("USDC");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({ color: "", size: "", quantity: 0 });
  const [flash, setFlash] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const connection = new Connection(env.NEXT_PUBLIC_QUICKNODE_RPC || "https://api.mainnet-beta.solana.com", "confirmed");

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletId || !user?.isActive) {
        setError("Please connect a wallet and ensure your account is active.");
        return;
      }

      try {
        const storesQuery = query(collection(db, "stores"), where("sellerId", "==", walletId), where("local", "==", true));
        const storesSnapshot = await getDocs(storesQuery);
        if (storesSnapshot.empty) {
          setError("No local store found for this wallet. Contact support to register as a local seller.");
          return;
        }
        const store = storesSnapshot.docs[0];
        setStoreId(store.id);

        const productsQuery = query(collection(db, "products"), where("sellerId", "==", walletId), where("isActive", "==", true));
        const productsSnapshot = await getDocs(productsQuery);
        const fetchedProducts = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          image: doc.data().imageUrls && doc.data().imageUrls[0] ? doc.data().imageUrls[0] : "https://picsum.photos/600/300",
          price: doc.data().price || 0,
          variants: doc.data().variants || [],
        }));
        setProducts(fetchedProducts);

        const priceResponse = await fetch('/api/solPrice');
        const priceData = await priceResponse.json();
        setSolPrice(priceData.solana?.usd || 200);
      } catch (err) {
        console.error("Error fetching POS data:", err);
        setError("Failed to load store or products. Please try again.");
      }
    };
    fetchData();
  }, [walletId, user]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const priceResponse = await fetch('/api/solPrice');
        const priceData = await priceResponse.json();
        const newSolPrice = priceData.solana?.usd || 200;
        if (newSolPrice !== solPrice) {
          console.log("Updated SOL price:", newSolPrice);
          setSolPrice(newSolPrice);
          setFlash(true);
          setTimeout(() => setFlash(false), 800);
        }
      } catch (err) {
        console.error("Error updating SOL price:", err);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [solPrice]);

  useEffect(() => {
    generateQRCode();
  }, [cart, paymentCurrency, solPrice]);

  const addToCart = (productId) => {
    if (selectedProduct && selectedProduct.id === productId) {
      const variantKey = `${selectedVariant.color}-${selectedVariant.size}`;
      const availableQuantity = getAvailableQuantity(selectedProduct, selectedVariant.color, selectedVariant.size);
      if (availableQuantity >= selectedVariant.quantity && selectedVariant.quantity > 0) {
        setCart(prev => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            [variantKey]: (prev[productId]?.[variantKey] || 0) + selectedVariant.quantity,
          },
        }));
        setSelectedProduct(null);
        setSelectedVariant({ color: "", size: "", quantity: 0 });
      } else {
        setError("Selected quantity exceeds available stock or is invalid.");
      }
    } else {
      setSelectedProduct(products.find(p => p.id === productId));
    }
  };

  const removeFromCart = (productId, variantKey) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId]?.[variantKey] > 1) newCart[productId][variantKey]--;
      else delete newCart[productId]?.[variantKey];
      if (Object.keys(newCart[productId] || {}).length === 0) delete newCart[productId];
      return newCart;
    });
  };

  const calculateFees = (total, itemCount) => {
    const percentFee = total * 0.01; // 1% of total
    const itemFee = 0.35 * itemCount; // $0.35 per item
    const fee = percentFee + itemFee;
    const sellerAmount = total - fee;
    return { fee, sellerAmount };
  };

  const generateQRCode = async () => {
    if (!cartItems.length) {
      setQrCodeUrl(null);
      setTransactionId(null);
      return;
    }

    try {
      const f4cetsPublicKey = new PublicKey(F4CETS_WALLET);
      const itemCount = cartItems.length;
      const totalUsdc = cartTotal;
      const { fee, sellerAmount } = calculateFees(totalUsdc, itemCount);
      const totalSol = totalUsdc / solPrice;
      const feeSol = fee / solPrice;
      const sellerAmountSol = sellerAmount / solPrice;

      const paymentAmount = paymentCurrency === "USDC" ? totalUsdc : totalSol;
      const memo = `F4cetsPOS|Store:${storeId}|Total:${paymentAmount.toFixed(2)}${paymentCurrency}|Fee:${(paymentCurrency === "USDC" ? fee : feeSol).toFixed(2)}${paymentCurrency}|Seller:${(paymentCurrency === "USDC" ? sellerAmount : sellerAmountSol).toFixed(2)}${paymentCurrency}|Items:${itemCount}`;

      const deepLink = `solana:${f4cetsPublicKey.toBase58()}?amount=${paymentAmount.toFixed(2)}&label=F4cetsPOS&message=${encodeURIComponent(memo)}`;
      const qrCode = await QRCode.toDataURL(deepLink);
      setQrCodeUrl(qrCode);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
      setQrCodeUrl(null);
    }
  };

  const checkTransactionStatus = async (signature) => {
    try {
      const status = await connection.getSignatureStatus(signature);
      if (status && status.value && status.value.confirmationStatus === "confirmed") {
        await splitPayment(signature);
        setTransactionId(signature);
        setCart({}); // Clear cart on submission
        setError(null);
      }
    } catch (err) {
      console.error("Error checking transaction status:", err);
    }
  };

  const splitPayment = async (signature) => {
    const itemCount = cartItems.length;
    const totalUsdc = cartTotal;
    const { fee, sellerAmount } = calculateFees(totalUsdc, itemCount);
    const totalSol = totalUsdc / solPrice;
    const feeSol = fee / solPrice;
    const sellerAmountSol = sellerAmount / solPrice;

    const payload = {
      transactionId: signature,
      sellerWallet: walletId,
      totalAmount: paymentCurrency === "USDC" ? totalUsdc : totalSol,
      itemCount,
      currency: paymentCurrency,
      fee: paymentCurrency === "USDC" ? fee : feeSol,
      sellerAmount: paymentCurrency === "USDC" ? sellerAmount : sellerAmountSol,
    };

    const response = await fetch(SPLIT_PAYMENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  useEffect(() => {
    if (qrCodeUrl && !transactionId) {
      const interval = setInterval(async () => {
        const signatures = await connection.getSignaturesForAddress(new PublicKey(F4CETS_WALLET), { limit: 10 });
        const recentSignature = signatures[0]?.signature;
        if (recentSignature && !transactionId) {
          await checkTransactionStatus(recentSignature);
        }
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [qrCodeUrl, transactionId]);

  const cartTotal = Object.entries(cart).reduce((total, [productId, variants]) => {
    const product = products.find(p => p.id === productId);
    const totalForProduct = Object.entries(variants).reduce((subTotal, [variantKey, quantity]) => {
      return subTotal + (product?.price || 0) * quantity;
    }, 0);
    return total + totalForProduct;
  }, 0);

  const cartItems = Object.entries(cart).flatMap(([productId, variants]) =>
    Object.entries(variants).map(([variantKey, quantity]) => {
      const product = products.find(p => p.id === productId);
      const [color, size] = variantKey.split('-');
      return { ...product, quantity, color, size };
    })
  );

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setSelectedVariant(prev => {
      const newVariant = { ...prev, [name]: value };
      if (name === "quantity") {
        const available = getAvailableQuantity(selectedProduct, newVariant.color, newVariant.size);
        return { ...newVariant, quantity: Math.min(parseInt(value) || 0, available) };
      }
      return newVariant;
    });
  };

  const getAvailableQuantity = (product, color, size) => {
    const variant = product?.variants?.find(v => v.color === color && v.size === size);
    return variant ? parseInt(variant.quantity) || 0 : 0;
  };

  return (
    <div>
      <Header
        brand="F4cets POS"
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 300,
          color: "info",
        }}
        onDisconnect={disconnect}
      />
      <Parallax image="/img/examples/exampleshop1.jpg" filter="dark" small>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              sm={8}
              className={classNames(
                classes.mlAuto,
                classes.mrAuto,
                classes.textCenter
              )}
            >
              <div className={classes.brand}>
                <h1 className={classes.title}>Point of Sale</h1>
                <h4>Manage your local sales</h4>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        {error ? (
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={6} md={6} className={classes.textCenter}>
              <h2>{error}</h2>
              <Button color="info" onClick={() => window.location.reload()}>Retry</Button>
            </GridItem>
          </GridContainer>
        ) : (
          <div className={classes.posContainer}>
            <div className={classes.productGrid}>
              <GridContainer spacing={2}>
                {products.map((product) => (
                  <GridItem xs={12} sm={6} md={4} key={product.id}>
                    <Card className={classes.card} onClick={() => addToCart(product.id)}>
                      <CardBody>
                        <img src={product.image} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                        <h4>{product.name}</h4>
                        <p>${product.price.toFixed(2)} USDC</p>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </GridContainer>
            </div>
            <div className={classes.checkoutSummary}>
              <h3>Checkout Summary</h3>
              <FormControl fullWidth margin="normal">
                <InputLabel>Payment Currency</InputLabel>
                <Select value={paymentCurrency} onChange={(e) => setPaymentCurrency(e.target.value)}>
                  <MenuItem value="USDC">USDC</MenuItem>
                  <MenuItem value="SOL">SOL</MenuItem>
                </Select>
              </FormControl>
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map(item => {
                    const total = item.price * item.quantity;
                    const solTotal = total / solPrice;
                    const { fee, sellerAmount } = calculateFees(total, 1); // 1 item per line
                    const solFee = fee / solPrice;
                    const solSellerAmount = sellerAmount / solPrice;
                    return (
                      <div key={`${item.id}-${item.color}-${item.size}`} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                        <Button size="sm" color="danger" onClick={() => removeFromCart(item.id, `${item.color}-${item.size}`)}>x</Button>
                        <span style={{ marginLeft: "16px" }}>{item.name} ({item.color}, {item.size}) x{item.quantity}</span>
                        <span style={{ marginLeft: "auto", marginRight: "0" }}>
                          {paymentCurrency === "USDC" ? `$${total.toFixed(2)}` : `${solTotal.toFixed(4)} SOL`}
                        </span>
                      </div>
                    );
                  })}
                  <hr />
                  <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                    <span>Total: </span>
                    <motion.span
                      animate={flash ? { scale: [1, 1.3, 1], color: ['#555', '#6FCBA9', '#555'] } : {}}
                      transition={{ duration: 0.8 }}
                      style={{ fontFamily: '"Quicksand", sans-serif', fontSize: '14px', color: '#555' }}
                    >
                      {paymentCurrency === "USDC" ? `$${cartTotal.toFixed(2)}` : `${(cartTotal / solPrice).toFixed(4)} SOL`}
                    </motion.span>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#777" }}>
                    Fee: {paymentCurrency === "USDC" ? `$${calculateFees(cartTotal, cartItems.length).fee.toFixed(2)}` : `${(calculateFees(cartTotal, cartItems.length).fee / solPrice).toFixed(4)} SOL`}
                    <br />
                    Seller: {paymentCurrency === "USDC" ? `$${calculateFees(cartTotal, cartItems.length).sellerAmount.toFixed(2)}` : `${(calculateFees(cartTotal, cartItems.length).sellerAmount / solPrice).toFixed(4)} SOL`}
                  </div>
                  {qrCodeUrl ? (
                    <div className={classes.qrCode}>
                      <img src={qrCodeUrl} alt="Payment QR Code" />
                      <p>Scan to pay with your Solana wallet. Awaiting confirmation...</p>
                    </div>
                  ) : (
                    <Button color="success" fullWidth style={{ marginTop: "16px" }} onClick={generateQRCode} disabled={cartItems.length === 0}>
                      Generate QR Code
                    </Button>
                  )}
                </>
              ) : (
                <p>No items in cart</p>
              )}
              <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
                <DialogTitle>Select Variant</DialogTitle>
                <DialogContent>
                  {selectedProduct && (
                    <GridContainer>
                      <GridItem xs={12}>
                        <FormControl fullWidth className={classes.variantSelector} margin="normal">
                          <InputLabel>Color</InputLabel>
                          <Select value={selectedVariant.color} name="color" onChange={handleVariantChange}>
                            {selectedProduct.variants.map((v, index) => (
                              <MenuItem key={`${selectedProduct.id}-${index}`} value={v.color}>{v.color}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem xs={12}>
                        <FormControl fullWidth className={classes.variantSelector} margin="normal">
                          <InputLabel>Size</InputLabel>
                          <Select value={selectedVariant.size} name="size" onChange={handleVariantChange}>
                            {selectedProduct.variants
                              .filter(v => v.color === selectedVariant.color)
                              .map((v, index) => (
                                <MenuItem key={`${selectedProduct.id}-${index}`} value={v.size}>{v.size}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem xs={12}>
                        <FormControl fullWidth className={classes.variantSelector} margin="normal">
                          <InputLabel>Quantity</InputLabel>
                          <Select value={selectedVariant.quantity} name="quantity" onChange={handleVariantChange}>
                            {[...Array(getAvailableQuantity(selectedProduct, selectedVariant.color, selectedVariant.size) + 1).keys()].slice(1).map(q => (
                              <MenuItem key={q} value={q}>{q}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSelectedProduct(null)} color="danger">Cancel</Button>
                  <Button onClick={() => addToCart(selectedProduct.id)} color="success" disabled={!selectedVariant.color || !selectedVariant.size || !selectedVariant.quantity}>
                    Add to Cart
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        )}
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!transactionId}
        autoHideDuration={6000}
        onClose={() => setTransactionId(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setTransactionId(null)} severity="success" sx={{ width: "100%" }}>
          Payment processed! Transaction ID: {transactionId}
        </Alert>
      </Snackbar>
      <Footer theme="dark" content={<div />} />
    </div>
  );
}