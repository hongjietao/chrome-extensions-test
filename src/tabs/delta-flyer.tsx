import "~style.css";

import { Input, Button, Form, message } from "antd";
import { useState } from "react";
import ReactJson from "react-json-view";

const { TextArea } = Input;

const DeltaFlyerPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState("");
  const safePrase = (data: string | object) => {
    try {
      if (typeof data === "string" && isValidJSONObject(data)) {
        return JSON.parse(data);
      } else {
        return data;
      }
    } catch (e) {
      message.error(e);
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
      setData(safePrase(common_biz_data));
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
  return (
    <>
      <div className="flex flex-row w-full h-300 mt-10">
        <div className="basis-1/2 p-2">
          <Form form={form} layout="vertical" autoComplete="off">
            <Form.Item name={"raw_data"}>
              <TextArea
                rows={40}
                placeholder="在此处输入raw_data"
                maxLength={6000000}
                showCount
              />
            </Form.Item>
          </Form>
        </div>

        <div className="basis-1/2 h-300 overflow-y-scroll p-2">
          <div className="mb-6">
            <Button onClick={() => getCommonBizData()}>
              从数据中获取 common_biz_data
            </Button>
          </div>
          <div className="ring-2 ring-blue-500 ring-inset rounded p-2">
            <ReactJson src={safePrase(data)}></ReactJson>
          </div>
        </div>
      </div>
    </>
  );
};
export default DeltaFlyerPage;
