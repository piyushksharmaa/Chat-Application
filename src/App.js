import {
  Box,
  Button,
  Container,
  VStack,
  Input,
  HStack,
  Heading,
} from "@chakra-ui/react";
import Message from "./components/Message";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { app } from "./firebase";
import { useEffect, useState, useRef } from "react";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
const auth = getAuth(app);
const db = getFirestore(app);
const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};
const logoutHandler = () => {
  signOut(auth);
};

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divforscroll = useRef(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });

      divforscroll.current.scrollIntoView({ behaviour: "smooth" });
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    const input = query(
      collection(db, "Messages"),
      orderBy("createdAt", "asc")
    );
    const unSubscribe = onAuthStateChanged(auth, (data) => {
      // console.log(data);
      setUser(data);
    });
    const unSubscribeforMessage = onSnapshot(input, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });
    return () => {
      unSubscribe();
      unSubscribeforMessage();
    };
  }, []);
  return (
    <Box bg={"blackAlpha.300"}>
      {user ? (
        <Container h={"100vh"} bg={"whiteAlpha.800"}>
          <VStack paddingY="4" h="full">
            <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>
              Logout
            </Button>
            <VStack
              h="full"
              w="full"
              bg={"yellow.100"}
              overflowY={"auto"}
              css={{
                "&::-webkit-scrollbar": {
                  display: "none ",
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                  // time={item.createdAt.second}
                />
              ))}
              <div ref={divforscroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  bg={"blackAlpha.100"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a Message..."
                />
                <Button colorScheme={"red"} type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack
          bgGradient="linear(to-l, #eb927e,#c9cf73 )"
          h={"100vh"}
          justifyContent={"center"}
          spacing={6}
        >
          <Heading color={"blackAlpha.700"}>ChatConnect</Heading>
          <Button onClick={loginHandler} colorScheme={"red"}>
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
