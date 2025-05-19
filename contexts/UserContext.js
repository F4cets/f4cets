/**
=========================================================
* F4cets Marketplace - User Context for Managing Wallet and Role
=========================================================

* Copyright 2025 F4cets Team
*/

import { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "/firebase";

const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (connected && publicKey) {
        const walletId = publicKey.toString();
        console.log("UserContext: Fetching user data for wallet:", walletId);
        try {
          const userDocRef = doc(db, "users", walletId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              walletId,
              role: data.role || "buyer",
              isActive: data.isActive !== false, // Default to true if undefined
              profile: {
                name: data.name || "User",
                avatar: data.avatar || "/assets/images/default-avatar.png",
                email: data.email || "",
              },
            });
            console.log("UserContext: User data fetched:", { walletId, role: data.role, isActive: data.isActive });
          } else {
            console.log("UserContext: No user found, creating new user with role: buyer");
            const newUser = {
              walletId,
              role: "buyer",
              isActive: true, // New field for user activation status
              email: "",
              name: "User",
              avatar: "/assets/images/default-avatar.png",
              avatarUrl: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              storeIds: [],
              escrowIds: [],
              affiliateClicks: [],
              purchases: [],
              rewards: 0,
            };
            await setDoc(userDocRef, newUser);
            setUser({
              walletId,
              role: "buyer",
              isActive: true,
              profile: {
                name: "User",
                avatar: "/assets/images/default-avatar.png",
                email: "",
              },
            });
            console.log("UserContext: New user created:", { walletId, role: "buyer", isActive: true });
          }
        } catch (error) {
          console.error("UserContext: Error fetching or creating user data:", error);
          setUser(null);
        }
      } else {
        console.log("UserContext: No wallet connected, clearing user data");
        setUser(null);
      }
    };
    fetchUser();
  }, [connected, publicKey]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}