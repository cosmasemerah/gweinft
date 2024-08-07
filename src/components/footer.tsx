import React from "react";

import twitter from "../twitter-x-line.svg";
import telegram from "../telegram-line.svg";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center space-y-3 py-5">
      <div className="flex items-center justify-center gap-4">
        <a href="https://t.me/GweiToken">
          <img src={telegram} alt="Telegram" className="w-6 h-6" />
        </a>
        <a href="https://x.com/GweiToken_arb">
          <img src={twitter} alt="Twitter" className="w-6 h-6" />
        </a>
      </div>
      <p className="text-xs text-dark">All rights reserved, $GWEI 2024</p>
    </footer>
  );
};

export default Footer;
