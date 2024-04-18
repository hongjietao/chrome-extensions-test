import "~style.css";

import { Input, Button, Form, message, Select, InputNumber } from "antd";
import { useState } from "react";
import ReactJson from "react-json-view";
import { themeArr } from "./constant";

const { TextArea } = Input;

const DeltaFlyerPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState("");
  const [theme, setTheme] = useState(undefined);
  const [collapsed, setCollapsed] = useState(0);
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
      <Form
        form={form}
        layout="inline"
        autoComplete="off"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
      >
        <div className="flex flex-row w-full ">
          <div className="basis-1/2 p-2">
            <Form.Item name={"raw_data"}>
              <TextArea
                rows={40}
                placeholder="在此处输入raw_data"
                maxLength={6000000}
                showCount
              />
            </Form.Item>
          </div>

          <div className="basis-1/2 h-screen overflow-y-scroll p-2 relative">
            <div className="mb-6 sticky top-0 bg-slate-50 p-2 flex">
              <Button onClick={() => getCommonBizData()}>
                从数据中获取 common_biz_data
              </Button>

              {/* <Form.Item label="主题色">
                <Select
                  // showSearch
                  // className="pl-2 w-1/10"
                  placeholder="选择主题色"
                  optionFilterProp="children"
                  onChange={(value) => {
                    setTheme(value);
                  }}
                  allowClear
                  // onSearch={onSearch}
                  // filterOption={filterOption}
                  options={themeArr.map((value) => ({ value, label: value }))}
                />
              </Form.Item> */}
              <Form.Item
                label="折叠层级"
                style={{ width: "200px", marginLeft: "10px" }}
              >
                <InputNumber
                  min={0}
                  max={10}
                  onChange={(v) => setCollapsed(v)}
                  placeholder="请输入"
                />
              </Form.Item>
            </div>
            <div className="ring-2 ring-blue-100 ring-inset rounded p-2">
              <ReactJson
                name={false}
                theme={theme}
                quotesOnKeys={false}
                displayDataTypes={false}
                sortKeys={true}
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
