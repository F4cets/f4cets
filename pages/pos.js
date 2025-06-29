/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
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
import { collection, query, where, getDocs } from "firebase/firestore";
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from "/contexts/UserContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";

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
  successMessage: {
    color: "green",
    marginTop: "16px",
  },
  loading: {
    marginTop: "16px",
    textAlign: "center",
  },
  statusMessage: {
    color: "#555",
    marginTop: "16px",
    textAlign: "center",
  },
});

const F4CETS_WALLET = "2Wij9XGAEpXeTfDN4KB1ryrizicVkUHE1K5dFqMucy53"; // F4cets wallet
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC token address on Solana
const QUICKNODE_RPC = process.env.NEXT_PUBLIC_QUICKNODE_RPC || "https://api.mainnet-beta.solana.com";
const connection = new Connection(QUICKNODE_RPC, "confirmed");

export default function Pos() {
  const classes = useStyles();
  const { publicKey, disconnect } = useWallet();
  const { user } = useUser();
  const walletId = publicKey?.toBase58();
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
  const [success, setSuccess] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [referenceKey, setReferenceKey] = useState(Keypair.generate());
  const [statusMessage, setStatusMessage] = useState("Waiting for payment...");

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

  const checkTransaction = async () => {
    try {
      console.log(`Checking for ${paymentCurrency} transaction with reference: ${referenceKey.publicKey.toBase58()}`);
      const signatures = await connection.getSignaturesForAddress(
        new PublicKey(F4CETS_WALLET),
        { limit: 10 },
        "confirmed"
      );
      console.log("Signatures fetched:", signatures.map(sig => ({ signature: sig.signature, blockTime: sig.blockTime })));

      const now = Math.floor(Date.now() / 1000);
      const recentSignatures = signatures.filter(sig => now - sig.blockTime < 600); // Within 10 minutes

      for (const sigInfo of recentSignatures) {
        const signature = sigInfo.signature;
        const tx = await connection.getParsedTransaction(signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        if (tx && tx.meta && tx.meta.logMessages) {
          const memoLog = tx.meta.logMessages.find(log => log.includes("Memo (len"));
          if (memoLog) {
            const memoMatch = memoLog.match(/Memo \(len \d+\): "(.+?)"/);
            if (memoMatch && memoMatch[1]) {
              const memo = memoMatch[1];
              const expectedMemoPrefix = `F4cetsPOS|Store:${storeId}|Total:${cartTotal.toFixed(2)}`;
              const expectedReference = referenceKey.publicKey.toBase58();
              console.log("Memo found:", memo);
              console.log("Expected memo prefix:", expectedMemoPrefix);
              console.log("Reference match:", memo.includes(expectedReference));
              if (memo.startsWith(expectedMemoPrefix) && memo.includes(expectedReference)) {
                console.log("Detected valid transaction:", signature);
                setTransactionSignature(signature);
                setStatusMessage("Processing payment...");
                await handlePaymentSubmission(signature);
                return true; // Stop after finding a valid transaction
              }
            }
          }
        }
      }
      setStatusMessage("Waiting for payment...");
      return false;
    } catch (err) {
      console.error("Error checking transactions:", err);
      setError("Failed to check transaction. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    // Generate new QR code when cart or paymentCurrency changes
    generateQRCode();

    let interval;
    if (cartItems.length > 0 && referenceKey) {
      console.log(`Starting polling for ${paymentCurrency} transaction with reference: ${referenceKey.publicKey.toBase58()}`);
      const startTime = Date.now();
      const timeoutMs = 5 * 60 * 1000; // 5 minutes
      interval = setInterval(async () => {
        if (Date.now() - startTime > timeoutMs) {
          console.log("Polling timed out");
          clearInterval(interval);
          setStatusMessage("Payment not detected. Please confirm manually or try again.");
          return;
        }
        const found = await checkTransaction();
        if (found) {
          console.log("Stopping polling");
          clearInterval(interval);
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (interval) {
        console.log("Stopping polling");
        clearInterval(interval);
      }
    };
  }, [cart, paymentCurrency]);

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
    if (!cartItems.length || !referenceKey) {
      setQrCodeUrl(null);
      setTransactionSignature(null);
      setStatusMessage("Waiting for payment...");
      return;
    }

    try {
      const f4cetsPublicKey = new PublicKey(F4CETS_WALLET);
      const itemCount = cartItems.length;
      const totalUsdc = cartTotal;
      const totalSol = totalUsdc / solPrice;

      const paymentAmount = paymentCurrency === "USDC" ? totalUsdc : totalSol;
      let amountInUnits;
      let tokenAddress = null;

      if (paymentCurrency === "USDC") {
        amountInUnits = paymentAmount; // USDC (decimal handled by wallet)
        tokenAddress = USDC_MINT_ADDRESS;
      } else {
        amountInUnits = paymentAmount; // SOL in SOL units
      }

      const { fee, sellerAmount } = calculateFees(totalUsdc, itemCount);
      const memo = `F4cetsPOS|Store:${storeId}|Total:${totalUsdc.toFixed(2)}|Fee:${fee.toFixed(2)}|Seller:${sellerAmount.toFixed(2)}|SellerWallet:${walletId}|Items:${itemCount}|Ref:${referenceKey.publicKey.toBase58()}`;
      const deepLink = `solana:${f4cetsPublicKey.toBase58()}?amount=${amountInUnits.toFixed(6)}&label=F4cetsPOS&memo=${encodeURIComponent(memo)}${tokenAddress ? `&spl-token=${tokenAddress}` : ""}`;

      console.log("Generated QR code with memo:", memo);
      QRCode.toDataURL(deepLink, (err, url) => {
        if (err) throw err;
        setQrCodeUrl(url);
        setStatusMessage("Waiting for payment...");
      });
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    }
  };

  const handlePaymentSubmission = async (signature) => {
    setLoading(true);
    setStatusMessage("Processing payment...");
    try {
      const { fee, sellerAmount } = calculateFees(cartTotal, cartItems.length);
      const response = await fetch('https://us-central1-f4cet-marketplace.cloudfunctions.net/processpospayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerWallet: walletId,
          totalAmount: cartTotal,
          itemCount: cartItems.length,
          currency: paymentCurrency,
          memo: `F4cetsPOS|Store:${storeId}|Total:${cartTotal.toFixed(2)}|Fee:${fee.toFixed(2)}|Seller:${sellerAmount.toFixed(2)}|SellerWallet:${walletId}|Items:${cartItems.length}|Ref:${referenceKey.publicKey.toBase58()}`,
          signature,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("Payment split successful, clearing cart");
        setSuccess(true);
        setCart({});
        setQrCodeUrl(null);
        setTransactionSignature(null);
        setReferenceKey(Keypair.generate());
        setStatusMessage(null);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        console.error("Payment split failed:", result.error);
        setStatusMessage(`Payment failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Error processing payment split:", err);
      setStatusMessage("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                    const { fee, sellerAmount } = calculateFees(total, 1);
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
                      <p>Scan to pay with your Solana wallet. Payment will be split by F4cets after submission.</p>
                      {loading && <p className={classes.loading}>Processing payment...</p>}
                      {success && <p className={classes.successMessage}>Payment submitted successfully! Cart cleared.</p>}
                      {statusMessage && <p className={classes.statusMessage}>{statusMessage}</p>}
                      <Button
                        color="info"
                        fullWidth
                        style={{ marginTop: "16px" }}
                        onClick={checkTransaction}
                        disabled={loading}
                      >
                        Confirm Payment
                      </Button>
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
      <Footer theme="dark" content={<div />} />
    </div>
  );
}