import { useState } from "react";
import { Button } from "antd";
import "~style.css";

function IndexPopup() {
  const [data, setData] = useState("");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 16,
        width: "200px",
      }}
      // className="w-200 flex items-center"
    >
      <h2 className="mx-auto">Welcome</h2>

      <Button
        className="w-full mt-4"
        onClick={() => {
          chrome.tabs.create({
            url: "./tabs/delta-flyer.html",
          });
        }}
      >
        one page
      </Button>
      {/* <button
        onClick={() => {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const { id } = tabs[0]
              chrome.scripting.executeScript({
                target: { tabId: id },
                func: () => {
                  const iframe = document.createElement("iframe")
                  iframe.src = chrome.runtime.getURL("/tabs/delta-flyer.html")
                  iframe.name = "delta-flyer"
                  document.body.appendChild(iframe)
                }
              })
            }
          )
        }}>
        啊？
      </button> */}
    </div>
  );
}

export default IndexPopup;
