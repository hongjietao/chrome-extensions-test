import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: "200px",
      }}>
      <h2>
        Welcome 
      </h2>

      <button
        onClick={() => {
          chrome.tabs.create({
            url: "./tabs/delta-flyer.html"
          })
        }}>
        第一个页面
      </button>
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
  )
}

export default IndexPopup
