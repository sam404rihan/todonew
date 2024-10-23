"use client";
// src/app/page.js
import { useRef, useState, useEffect } from "react"; // Import React hooks
import { db } from "./firebase.js"; // Adjust the import path for Firebase
import { addDoc, collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore"; // Import Firestore functions

export default function Home() {
    const messageRef = useRef(); // Create a reference for the input field
    const ref = collection(db, "messages"); // Reference to the Firestore collection

    const [messages, setMessages] = useState([]); // State to hold fetched messages

    // Function to fetch data from Firestore in order (by timestamp)
    const fetchMessages = async () => {
        try {
            const q = query(ref, orderBy("timestamp", "desc")); // Query to order messages by timestamp
            const querySnapshot = await getDocs(q);
            const fetchedMessages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages); // Update state with fetched messages
        } catch (e) {
            console.error(e); // Log any errors
        }
    };

    // Fetch messages on component mount
    useEffect(() => {
        fetchMessages();
    }, []);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        const messageText = messageRef.current.value; // Get the message from the input

        if (messageText.trim()) { // Check if the input is not empty
            try {
                await addDoc(ref, {
                    text: messageText,
                    timestamp: new Date(), // Add a timestamp
                });
                messageRef.current.value = ""; // Clear the input field
                fetchMessages(); // Refresh messages after adding a new one
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    // Function to delete a message
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(ref, id)); // Delete the document from Firestore
            fetchMessages(); // Refresh messages after deletion
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="task">Task</label>
                    <input type="text" placeholder="Enter task" ref={messageRef} />
                    <button type="submit">Add</button>
                </form>
            </div>
            
            <div>
                <h1>Messages</h1>
                <ul>
                    {messages.map((message) => (
                        <li key={message.id}>
                            {message.text}
                            <button onClick={() => handleDelete(message.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
