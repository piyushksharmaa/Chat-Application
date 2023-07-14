import React from "react";
import { Text, Avatar, HStack, Flex } from "@chakra-ui/react";
const Message = ({ text, uri, user = "other" }) => {
  return (
    <HStack
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      borderRadius={"base"}
      backgroundColor={"blackAlpha.100"}
      paddingX={user === "me" ? "4" : "2"}
      paddingY={"1"}
    >
      {user === "other" && <Avatar src={uri} />}
      <Flex>
        <Text paddingY={"2.5"} paddingX={"2"}>
          {text}
        </Text>

        {user === "me" && <Avatar src={uri} />}
        {/* <Text>{time}</Text> */}
      </Flex>
    </HStack>
  );
};

export default Message;
