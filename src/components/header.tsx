import React from "react";
import { client } from "../client";
import logo from "../logo.png";
import { ConnectButton } from "thirdweb/react";

const Header = () => {
  return (
    <header className="w-full p-8">
      <div className=" flex items-center justify-between">
        <div className="flex justify-center items-center">
          <a href="/">
            <img src={logo} alt="Logo" className="h-16 w-16 rounded-full" />
          </a>
        </div>
        <ConnectButton
          client={client}
          appMetadata={{
            name: "Gwei Token",
            url: "https://presale.gweitoken.io/",
          }}
        />
      </div>
    </header>
  );
};

export default Header;
