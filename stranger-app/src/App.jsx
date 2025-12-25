/**
 * Stranger App - Anonymous Real-time Chat Application
 * 
 * A React-based anonymous messaging platform that matches users randomly
 * and enables real-time conversations with complete anonymity. Features include:
 * - Anonymous authentication via Firebase
 * - Real-time user matching algorithm
 * - Firestore-backed message persistence
 * - Memory box to store conversation history
 * - Dynamic identity generation with themed names and colors
 * 
 * @component
 * @returns {JSX.Element} The main application component with authentication flow
 * 
 * @requires react
 * @requires firebase/app
 * @requires firebase/auth
 * @requires firebase/firestore
 * @requires lucide-react
 * 
 * 
 * @fires onAuthStateChanged - Listens for user authentication state changes
 * @fires onSnapshot - Real-time listeners for messages and invites
 * @fires serverTimestamp - Firestore server time for message ordering
 * 
 * @example
 * // App is exported as default and mounts to root
 * <App />
 */

/**
 * Creates a consistent room ID from two user IDs
 * Ensures both users reference the same room regardless of ID order
 * 
 * @function createRoomId
 * @param {string} userId1 - First user's UID
 * @param {string} userId2 - Second user's UID
 * @returns {string} Deterministic room ID in format "room_[id1]_[id2]"
 */

/**
 * Generates a random anonymous identity for the user
 * 
 * @function generateIdentity
 * @returns {Object} Identity object
 * @returns {string} returns.name - Generated name (e.g., "Neon Fox")
 * @returns {string} returns.color - Tailwind color class for avatar
 * @returns {string} returns.avatar - Single letter avatar
 */

/**
 * LoginScreen Component - Initial authentication interface
 * Allows users to enter the application anonymously or with a custom token
 * 
 * @component
 * @returns {JSX.Element} Login UI with branding and authentication button
 * @state {boolean} isLoading - Loading state during authentication
 * @state {string|null} error - Authentication error message
 */

/**
 * SearchingScreen Component - User matching interface
 * Implements the matching algorithm by querying waiting pool and managing invites
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.user - Current authenticated user
 * @param {Object} props.identity - Current user's identity
 * @param {Function} props.onCancel - Callback to cancel search
 * @param {Function} props.onMatchFound - Callback when match is found
 * @returns {JSX.Element} Searching UI with status updates
 * @state {string} status - Current search status message
 */

/**
 * ChatRoom Component - Real-time messaging interface
 * Manages message display, input, and persistence
 * 
 * @component
 * @param {Object} props
 * @param {string} props.roomId - Unique room identifier
 * @param {Object} props.user - Current user object
 * @param {Object} props.myIdentity - Current user's identity
 * @param {Object} props.strangerIdentity - Partner's identity
 * @param {Function} props.onLeave - Callback when leaving chat
 * @returns {JSX.Element} Chat interface with message history and input
 * @state {Array} messages - Array of message objects
 * @state {string} inputText - Current input text
 */

/**
 * MemoryViewer Component - Historical chat viewer
 * Displays past conversations in read-only mode
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.chat - Chat history object
 * @param {Function} props.onClose - Callback to close viewer
 * @param {string} props.myUid - Current user's UID for message alignment
 * @returns {JSX.Element} Memory view modal
 */

/**
 * Dashboard Component - Main application hub
 * Displays user identity, search button, and message history
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.user - Current user object
 * @param {Object} props.identity - User's generated identity
 * @param {Array} props.savedChats - Array of saved conversation objects
 * @param {Function} props.onStartSearch - Callback to initiate user search
 * @returns {JSX.Element} Dashboard UI with memory box and search interface
 * @state {Object|null} selectedChat - Currently viewed chat
 */
import React, { useState, useEffect, useRef } from 'react';
const NOTIFICATION_SOUND = new Audio("../public/girl-hey-ringtone.mp3");
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken,
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp, 
  setDoc
} from 'firebase/firestore';
import { User, Shield, Ghost, ArrowRight, Search, Clock, X, Send, LogOut, ChevronRight, Globe, Calendar, ArrowLeft } from 'lucide-react';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = 'stranger-app-v1';

// ====================================
// CRITICAL FIX: CONSISTENT ROOM ID
// ====================================
const createRoomId = (userId1, userId2) => {
  const [id1, id2] = [userId1, userId2].sort();
  return `room_${id1}_${id2}`;
};

const generateIdentity = () => {
  const colors = ['text-emerald-400', 'text-blue-400', 'text-amber-400', 'text-rose-400', 'text-purple-400', 'text-cyan-400'];
  const adjectives = ['Neon', 'Silent', 'Misty', 'Cosmic', 'Urban', 'Hollow', 'Electric', 'Solar', 'Lunar', 'Velvet'];
  const nouns = ['Fox', 'Storm', 'Echo', 'Ghost', 'Signal', 'Shadow', 'Void', 'Walker', 'Falcon', 'Owl'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return { name: `${adj} ${noun}`, color: color, avatar: noun.charAt(0) };
};

// Login Screen (unchanged)
const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnterVoid = async () => {
    setIsLoading(true);
    try {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Connection failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-8">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-4 rotate-3 hover:rotate-6 transition-transform duration-500">
          <Ghost size={48} className="text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Stranger</h1>
          <p className="text-lg text-slate-400">Connect deeply with real humans.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 w-full text-left bg-slate-900/50 p-6 rounded-xl border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Shield className="text-emerald-400" size={20} />
            <span className="text-sm text-slate-300">Total Anonymity. No Profiles.</span>
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="text-blue-400" size={20} />
            <span className="text-sm text-slate-300">Global Real-time Matching.</span>
          </div>
        </div>

        {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>}

        <button
          onClick={handleEnterVoid}
          disabled={isLoading}
          className="group w-full py-4 px-6 bg-white text-slate-950 font-bold text-lg rounded-xl shadow-xl shadow-indigo-500/10 hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <span className="animate-pulse">Connecting...</span> : <><span>Enter the Void</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
        </button>
      </div>
    </div>
  );
};

// ====================================
// FIXED: SEARCHING SCREEN
// ====================================
const SearchingScreen = ({ user, identity, onCancel, onMatchFound }) => {
  const [status, setStatus] = useState("Initializing...");
  const poolDocIdRef = useRef(null);
  const inviteListenerRef = useRef(null);
  const isMountedRef = useRef(true);
  const matchingAttemptedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    
    const findMatch = async () => {
      if (matchingAttemptedRef.current) return;
      matchingAttemptedRef.current = true;
      
      setStatus("Scanning for strangers...");

      try {
        const waitingPoolRef = collection(db, 'artifacts', appId, 'public', 'data', 'waiting_pool');
        const q = query(waitingPoolRef, where('status', '==', 'waiting'));
        const snapshot = await getDocs(q);
        
        const potentialMatches = snapshot.docs
          .filter(doc => doc.data().userId !== user.uid)
          .sort((a, b) => {
            const tA = a.data().timestamp?.toMillis() || 0;
            const tB = b.data().timestamp?.toMillis() || 0;
            return tA - tB;
          });

        if (!isMountedRef.current) return;

        if (potentialMatches.length > 0) {
          const matchDoc = potentialMatches[0];
          const matchData = matchDoc.data();
          
          setStatus("Found someone! Connecting...");
          
          await deleteDoc(matchDoc.ref);
          
          // USE FIXED ROOM ID FUNCTION
          const roomId = createRoomId(user.uid, matchData.userId);
          
          console.log("🔵 Created room as host:", roomId);
          
          const inviteRef = doc(db, 'artifacts', appId, 'users', matchData.userId, 'invites', user.uid);
          await setDoc(inviteRef, {
            roomId: roomId,
            hostIdentity: identity,
            timestamp: serverTimestamp(),
            status: 'active'
          });
          
          onMatchFound(roomId, matchData.identity);
        } else {
          poolDocIdRef.current = null;
          setStatus("Waiting for someone to join...");
          
          const poolDoc = await addDoc(waitingPoolRef, {
            userId: user.uid,
            identity: identity,
            status: 'waiting',
            timestamp: serverTimestamp()
          });
          
          poolDocIdRef.current = poolDoc.id;
          
          const invitesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'invites');
          
          inviteListenerRef.current = onSnapshot(invitesRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added' && isMountedRef.current) {
                const inviteData = change.doc.data();
                if (inviteData.status === 'active' && inviteData.roomId) {
                  setStatus("Match found! Joining...");
                  
                  console.log("🟢 Joining room as guest:", inviteData.roomId);
                  
                  if (poolDocIdRef.current) {
                    deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'waiting_pool', poolDocIdRef.current))
                      .catch(() => {});
                    poolDocIdRef.current = null;
                  }
                  
                  onMatchFound(inviteData.roomId, inviteData.hostIdentity);
                  deleteDoc(change.doc.ref).catch(() => {});
                }
              }
            });
          });
        }
      } catch (error) {
        console.error("❌ Matching error:", error);
        if (isMountedRef.current) {
          setStatus("Error. Retrying...");
          setTimeout(() => {
            matchingAttemptedRef.current = false;
            findMatch();
          }, 2000);
        }
      }
    };

    findMatch();

    return () => {
      isMountedRef.current = false;
      if (inviteListenerRef.current) inviteListenerRef.current();
      if (poolDocIdRef.current) {
        deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'waiting_pool', poolDocIdRef.current))
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden text-white">
      <div className="absolute w-[500px] h-[500px] border border-indigo-500/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
      <div className="absolute w-[300px] h-[300px] border border-indigo-500/40 rounded-full animate-[ping_3s_linear_infinite_1s]"></div>
      
      <div className="z-10 bg-slate-900/80 p-8 rounded-2xl border border-indigo-500/30 backdrop-blur-md max-w-sm w-full">
        <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Search size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Connecting...</h2>
        <p className="text-slate-400 mb-6 text-sm">{status}</p>
        
        <button onClick={onCancel} className="px-6 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors flex items-center justify-center mx-auto space-x-2">
          <X size={16} /><span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

// ====================================
// FIXED: CHAT ROOM
// ====================================

const ChatRoom = ({ roomId, user, myIdentity, strangerIdentity, onLeave }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);
  const unsubscribeRef = useRef(null);
  
  // Track previous message count to detect NEW messages for sound
  const prevMessageCountRef = useRef(0);

  useEffect(() => {
    console.log("📱 Setting up chat room:", roomId);
    
    const messagesRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
    const q = query(messagesRef, where('roomId', '==', roomId));

    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      
      msgs.sort((a, b) => {
        const tA = a.timestamp?.toMillis() || 0;
        const tB = b.timestamp?.toMillis() || 0;
        return tA - tB;
      });
      
      setMessages(msgs);
    }, (error) => {
      console.error("❌ Message listener error:", error);
    });

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [roomId]);

  // Handle Scroll and Sound
  useEffect(() => {
    // 1. Scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // 2. Play Sound Logic
    // We check if messages increased AND if we have history (prev > 0) to avoid playing on initial load
    // Note: This logic skips sound if the stranger sends the very first message in a fresh room, 
    // but prevents "dings" when loading old chat history.
    if (messages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Only play if the message is NOT from me
      if (lastMessage.senderId !== user.uid) {
        NOTIFICATION_SOUND.currentTime = 0;
        NOTIFICATION_SOUND.play().catch((e) => console.log("Sound blocked:", e));
      }
    }
    
    // Update ref for next render
    prevMessageCountRef.current = messages.length;
  }, [messages, user.uid]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const text = inputText;
    setInputText(''); // Optimistic clear

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
        roomId: roomId,
        text: text.trim(),
        senderId: user.uid,
        senderName: myIdentity.name,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("❌ Failed to send:", err);
    }
  };

  const handleLeaveChat = () => {
    onLeave({
      id: Date.now(),
      partner: strangerIdentity,
      messages: messages,
      lastMessage: messages[messages.length - 1]?.text || "No messages",
      date: new Date().toLocaleDateString(),
      timestamp: new Date()
    });
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold ${strangerIdentity.color} border border-slate-700`}>
            {strangerIdentity.avatar}
          </div>
          <div>
            <h3 className={`font-bold ${strangerIdentity.color}`}>{strangerIdentity.name}</h3>
            <span className="text-[10px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Connected
            </span>
          </div>
        </div>
        <button onClick={handleLeaveChat} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.senderId === user.uid 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-700 rounded-full px-2 py-2">
          <input 
            type="text" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..." 
            className="flex-1 bg-transparent text-white focus:outline-none text-sm h-10 px-2" 
          />
          <button 
            onClick={handleSend} 
            disabled={!inputText.trim()} 
            className="p-2 bg-indigo-600 text-white rounded-full disabled:opacity-50 disabled:bg-slate-700 hover:bg-indigo-500 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Memory Viewer and Dashboard (unchanged - keeping them short)
const MemoryViewer = ({ chat, onClose, myUid }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col">
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="ml-2 flex-1">
          <h3 className="text-white font-bold"><span className={chat.partner.color}>{chat.partner.name}</span></h3>
          <div className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={10} />{chat.date}</div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages?.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === myUid ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
              msg.senderId === myUid 
                ? 'bg-indigo-900/50 text-indigo-100 rounded-br-none border border-indigo-500/20' 
                : 'bg-slate-900 text-slate-300 rounded-bl-none border border-slate-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ user, identity, savedChats, onStartSearch }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {selectedChat && <MemoryViewer chat={selectedChat} onClose={() => setSelectedChat(null)} myUid={user.uid} />}
      
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Ghost size={24} className="text-indigo-500" />
          <span className="font-bold text-lg">Stranger</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-xs text-slate-500 hover:text-white transition-colors">Disconnect</button>
      </header>

      <div className="flex-1 flex flex-col max-w-md w-full mx-auto p-4 space-y-6">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-2">Identity</p>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold ${identity.color} border-2 border-slate-700`}>
              {identity.avatar}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${identity.color}`}>{identity.name}</h2>
              <p className="text-xs text-slate-400 flex items-center mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>Online
              </p>
            </div>
          </div>
        </div>

        <button onClick={onStartSearch} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center">
          <Search className="mb-2 text-white" size={32} />
          <span className="text-xl font-bold text-white">Find a Stranger</span>
        </button>

        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Memory Box ({savedChats.length})</h3>
          {savedChats.length === 0 ? (
            <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-8 text-center">
              <Clock size={32} className="text-slate-700 mb-3 mx-auto" />
              <p className="text-slate-500">No memories yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedChats.map((chat) => (
                <div key={chat.id} onClick={() => setSelectedChat(chat)} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-4 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold ${chat.partner.color} border border-slate-700`}>
                    {chat.partner.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm ${chat.partner.color}`}>{chat.partner.name}</h4>
                    <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [identity, setIdentity] = useState(null);
  const [savedChats, setSavedChats] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activePartnerIdentity, setActivePartnerIdentity] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && !identity) setIdentity(generateIdentity());
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleMatchFound = (roomId, partnerIdentity) => {
    setActiveRoomId(roomId);
    setActivePartnerIdentity(partnerIdentity);
    setView('chat');
  };

  const handleChatEnd = (chatData) => {
    setSavedChats(prev => [chatData, ...prev]);
    setActiveRoomId(null);
    setActivePartnerIdentity(null);
    setView('dashboard');
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;
  if (!user) return <LoginScreen />;
  if (view === 'searching') return <SearchingScreen user={user} identity={identity} onCancel={() => setView('dashboard')} onMatchFound={handleMatchFound} />;
  if (view === 'chat' && activeRoomId) return <ChatRoom roomId={activeRoomId} user={user} myIdentity={identity} strangerIdentity={activePartnerIdentity} onLeave={handleChatEnd} />;

  return <Dashboard user={user} identity={identity || {name: 'Stranger', color: 'text-white', avatar: '?'}} savedChats={savedChats} onStartSearch={() => setView('searching')} />;
}
