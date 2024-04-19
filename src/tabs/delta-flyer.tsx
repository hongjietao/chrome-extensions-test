import "~style.css";

import { Input, Button, Form, message, Select, InputNumber } from "antd";
import { useState } from "react";
/**
 * https://www.npmjs.com/package/@uiw/react-json-view
 * 后面换一下json展示的包
 */
import ReactJson from "react-json-view";
import { themeArr } from "./constant";

const { TextArea } = Input;
const COMMON_BIZ_DATA_LOCAL_KEY = "COMMON_BIZ_DATA_LOCAL";

const DeltaFlyerPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState("");
  const [theme, setTheme] = useState(undefined);
  const [collapsed, setCollapsed] = useState(2);
  const safePrase = (data: string | object) => {
    try {
      if (typeof data === "string" && isValidJSONObject(data)) {
        return JSON.parse(data);
      } else {
        return data;
      }
    } catch (e) {
      message.error(e);
      return data;
    }
  };

  function isValidJSONObject(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  const getValueByKey = (obj: Record<string, any>, key: string): any => {
    let result: any = undefined;

    // 如果当前对象包含指定的键，则直接返回其值
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }

    // 遍历当前对象的所有属性值
    for (const prop in obj) {
      // 确保属性值是对象类型且不为null
      if (typeof obj[prop] === "object" && obj[prop] !== null) {
        // 递归调用getValueByKey函数查找子对象中是否包含指定的键
        result = getValueByKey(obj[prop], key);
        // 如果找到了，则直接返回结果
        if (result !== undefined) {
          return result;
        }
      } else if (
        typeof obj[prop] === "string" &&
        isValidJSONObject(obj[prop])
      ) {
        result = getValueByKey(safePrase(obj[prop]), key);
        // 如果找到了，则直接返回结果
        if (result !== undefined) {
          return result;
        }
      }
    }

    return result;
  };
  function getValueByKeyBFS(obj: Record<string, any>, key: string): any {
    const queue: any[] = [obj]; // 使用队列存储待搜索的对象
    let result: any = undefined;

    // 广度优先搜索
    while (queue.length > 0) {
      const currentObj = queue.shift(); // 取出队列的第一个对象

      if (currentObj.hasOwnProperty(key)) {
        // 如果当前对象包含指定的键，则返回其值
        result = currentObj[key];
        break;
      }

      // 将当前对象的所有属性值加入到队列中
      for (const prop in currentObj) {
        if (typeof currentObj[prop] === "object" && currentObj[prop] !== null) {
          queue.push(currentObj[prop]);
        } else if (
          typeof currentObj[prop] === "string" &&
          isValidJSONObject(obj[prop])
        ) {
          queue.push(safePrase(currentObj[prop]));
        }
      }
    }

    return result;
  }

  function parseStringAsObject(input: string|object): any {  
    try {  
      const parsed =  safePrase(input);  
      if (typeof parsed === 'object' && parsed !== null) {  
        for (const key in parsed) {  
          // if(key === '22') {
          //   console.log(parsed[key])
          // }
          console.log('===>>> key', key, typeof key)
          parsed[key] = parseStringAsObject(parsed[key]);   
        }  
      }  
      return parsed;  
    } catch (e) {  
      // 如果解析失败，返回原始字符串  
      console.log('===>>> 解析失败的字符串', input)
      return input;  
    }  
  }

  const getCommonBizData = async () => {
    try {
      const formData = await form.validateFields();
      console.log("===>>> formData", formData);
      const { raw_data } = formData;
      if (!isValidJSONObject(raw_data)) {
        message.error("Invalid raw data");
        return;
      }
      const obj = safePrase(raw_data);

      const common_biz_data = getValueByKeyBFS(obj, "common_biz_data");

      if (
        typeof common_biz_data === "string" &&
        !isValidJSONObject(common_biz_data)
      ) {
        message.error("Invalid common_biz_data");
      }
      console.log("===>>> common_biz_data", common_biz_data);
      if (!common_biz_data) {
        // 如果common_biz_data不存在，则解析原始数据

        setData(parseStringAsObject(raw_data));

        message.info("在JSON里面没找到common_biz_data, 解析原始对象");
      } else {
        setData(safePrase(common_biz_data));
      }
      console.log(
        "===>>> common_bizData",
        typeof common_biz_data,
        safePrase(common_biz_data)
      );
    } catch (e) {
      message.error(e?.message || "错误");
    }
  };
  const copy = (data: string) => {
    copyToClipboard(JSON.stringify(data));
  };

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Copied to clipboard successfully");
    } catch (err) {
      message.error("Copied to clipboard error: ");
    }
  }

  function saveDataToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    message.success("Saved to local storage successfully");
  }

  const saveData = (data: {
    time_stamp: number;
    common_biz_data: any;
    desc: string;
  }) => {
    try {
      const oldData = localStorage.getItem(COMMON_BIZ_DATA_LOCAL_KEY);
      const parsedData = oldData ? JSON.parse(oldData) : [];
      console.log(
        "Saved to local storage",
        typeof oldData,
        parsedData,
        oldData
      );
      parsedData.push(data);
      localStorage.setItem(
        COMMON_BIZ_DATA_LOCAL_KEY,
        JSON.stringify(parsedData)
      );
      message.success("Saved to local storage successfully");
    } catch (e) {
      message.error("Saved to local storage Error");
      console.error(e);
    }
  };

  function getDataFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  return (
    <>
      <Form
        form={form}
        layout="inline"
        autoComplete="off"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
      >
        <div className="flex flex-row w-full ">
          <div className="basis-1/3 p-2">
            <Form.Item name={"raw_data"}>
              <TextArea
                rows={40}
                placeholder="在此处输入raw_data"
                maxLength={6000000}
                showCount
              />
            </Form.Item>
          </div>

          <div className="basis-2/3 h-screen overflow-y-scroll p-2 relative">
            <div className="mb-6 sticky top-0 bg-slate-50 p-2 flex">
              <Button onClick={() => getCommonBizData()}>
                从数据中获取 common_biz_data
              </Button>

              <Form.Item
                label="折叠层级"
                style={{ width: "200px", marginLeft: "10px" }}
              >
                <InputNumber
                  min={0}
                  max={10}
                  value={collapsed}
                  onChange={(v) => setCollapsed(v)}
                  placeholder="请输入"
                />
              </Form.Item>

              <Button
                style={{
                  marginLeft: "10px",
                }}
                onClick={() => {
                  saveData({
                    time_stamp: new Date().getTime(),
                    common_biz_data: data,
                    desc: "common_biz_data",
                  });
                }}
              >
                暂存数据
              </Button>
            </div>
            <div className="ring-2 ring-blue-100 ring-inset rounded p-2">
              <ReactJson
                name={false}
                theme={theme}
                quotesOnKeys={false}
                displayDataTypes={false}
                // highlightUpdates={true}
                // sortKeys={true}
                src={safePrase(data)}
                collapsed={collapsed}
              ></ReactJson>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};
export default DeltaFlyerPage;
