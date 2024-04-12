import "~style.css";

import { Input, Button, Form, message } from "antd";
import { useState } from "react";

const { TextArea } = Input;

const DeltaFlyerPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState("asdbajdanjksdnaj13123143");

  const getCommonBizData = async () => {
    try {
      const formData = await form.validateFields();
      console.log("===>>> formData", formData);
    } catch (e) {
      message.error(e?.message || "错误");
    }
  };
  const copy = (data: string) => {
    copyToClipboard(data);
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
    <div className="w-full">
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name={"row_data"}>
          <TextArea
            rows={24}
            placeholder="maxLength is 60w"
            maxLength={600000}
            showCount
          />
        </Form.Item>
      </Form>
      <Button onClick={() => getCommonBizData()}>获取 common_biz_data</Button>
      <Button onClick={() => copy(data)}>复制数据</Button>
    </div>
  );
};
export default DeltaFlyerPage;
