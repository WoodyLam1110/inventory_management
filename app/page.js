'use client'
import Image from "next/image";
import { collection, query, getDocs, deleteDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, "inventory", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(firestore, "inventory", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = () => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: 'url(/pantry.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'transparent',
          color: '#311A2D',
          border: '1px solid #796477',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#c8c2ca"
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          <Typography variant="h2" color="#511556">
            Pantry Inventory
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow="auto"
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography
                variant="h3"
                color="#333"
                textAlign="left"
                flex={1}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h3"
                color="#333"
                textAlign="right"
                flex={1}
              >
                {quantity}
              </Typography>
              <Stack 
                direction="row"
                spacing ={2}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name);
                  }}
                  sx={{
                    backgroundColor: '#483345',
                    '&:hover': {
                      backgroundColor: '#763B7B',
                    },
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name);
                  }}
                  sx={{
                    backgroundColor: '#483345',
                    '&:hover': {
                      backgroundColor: '#763B7B',
                    },
                  }}

                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      
      <Typography variant="h4" color = "#311A2D">Search Item</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              border: '1px solid #796477',
            },
          }}
        />
         <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: 'transparent',
            color: '#311A2D',
            border: '1px solid #796477',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          Search
        </Button>
      </Stack>
    </Box>
  );
}
