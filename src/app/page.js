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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Tasks</h1>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Enter task"
                            ref={messageRef}
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Add
                        </button>
                    </div>
                </form>
                <ul className="space-y-2">
                    {messages.map((message) => (
                        <li key={message.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow hover:bg-gray-100">
                            <span>{message.text}</span>
                            <button
                                onClick={() => handleDelete(message.id)} // Call handleDelete with the message id
                                className="text-red-600 hover:text-red-800 transition"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
