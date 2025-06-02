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
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      if (connected && publicKey) {
        const walletId = publicKey.toString();
        console.log("UserContext: Fetching user data for wallet:", walletId);
        try {
          const userDocRef = doc(db, "users", walletId);
          // Retry logic to handle potential Firestore delays
          let userDoc = null;
          for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`UserContext: Attempt ${attempt} to fetch user data for ${walletId}`);
            userDoc = await getDoc(userDocRef, { source: attempt === 1 ? 'default' : 'server' });
            if (userDoc.exists()) {
              break;
            }
            console.log(`UserContext: Attempt ${attempt} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
          }

          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("UserContext: Raw Firestore data:", JSON.stringify(data, null, 2));
            setUser({
              walletId,
              role: data.role || "buyer",
              isActive: data.isActive !== false,
              nfts: Array.isArray(data.profile?.nfts) ? data.profile.nfts : [], // Use profile.nfts
              profile: {
                name: data.profile?.name || "User",
                avatar: data.profile?.avatar || "/assets/images/default-avatar.png",
                email: data.profile?.email || "",
              },
            });
            console.log("UserContext: User data fetched:", {
              walletId,
              role: data.role,
              isActive: data.isActive,
              nfts: Array.isArray(data.profile?.nfts) ? data.profile.nfts : 'empty'
            });
          } else {
            console.log("UserContext: No user found, creating new user with role: buyer");
            const newUser = {
              walletId,
              role: "buyer",
              isActive: true,
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
              profile: { // Add profile subfield
                name: "User",
                avatar: "/assets/images/default-avatar.png",
                email: "",
                nfts: [],
              },
            };
            await setDoc(userDocRef, newUser);
            setUser({
              walletId,
              role: "buyer",
              isActive: true,
              nfts: [],
              profile: {
                name: "User",
                avatar: "/assets/images/default-avatar.png",
                email: "",
              },
            });
            console.log("UserContext: New user created:", { walletId, role: "buyer", isActive: true, nfts: [] });
          }
        } catch (error) {
          console.error("UserContext: Error fetching or creating user data:", error);
          setUser(null);
        } finally {
          setLoading(false); // Set loading to false
        }
      } else {
        console.log("UserContext: No wallet connected, clearing user data");
        setUser(null);
        setLoading(false);
      }
    };
    fetchUser();
  }, [connected, publicKey]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}