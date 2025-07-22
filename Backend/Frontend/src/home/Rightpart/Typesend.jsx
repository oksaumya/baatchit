import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile, BsPaperclip } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../../context/useSendMessage.js";

function Typesend() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { loading, sendMessages } = useSendMessage();
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessages(message);
    setMessage("");
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
    // Focus input after emoji select
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 0);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Handle file input
  const handleFileButtonClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just log the file
      console.log("Selected file:", file);
      // You can implement file sending logic here
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center space-x-2 h-12 bg-gray-800 px-2 relative rounded-xl">
        {/* File Attach Button */}
        <button
          type="button"
          onClick={handleFileButtonClick}
          className="text-xl text-gray-400 hover:text-blue-400 transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
          title="Attach file"
        >
          <BsPaperclip />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full py-3 px-3 pr-10 rounded-lg border border-gray-600 bg-slate-900 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base font-light transition-all duration-200"
            style={{ minHeight: "44px", maxHeight: "44px" }}
          />
          {/* Emoji Button inside input */}
          <button
            ref={emojiButtonRef}
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
            title="Add emoji"
            tabIndex={-1}
          >
            <BsEmojiSmile className="text-lg" />
          </button>
        </div>
        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          title="Send message"
        >
          <IoSend className="text-lg" />
        </button>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full left-10 mb-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 px-2">Choose an emoji</h3>
            </div>
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              width={300}
              height={320}
              searchDisabled={false}
              skinTonesDisabled={false}
              lazyLoadEmojis={true}
              searchPlaceholder="Search emojis..."
            />
          </div>
        )}
      </div>
    </form>
  );
}

export default Typesend;
