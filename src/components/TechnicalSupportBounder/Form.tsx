import { ELoaiPhanHoi } from '@/services/TienIch/PhanHoi/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';
import FormItemUrlOrUpload from '../Upload/FormItemUrlOrUpload';
import { useEffect } from 'react';
import { resetFieldsForm } from '@/utils/utils';

const FormPostIssue = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
    const { formSubmiting, postModel, setFormSubmiting } = useModel('tienich.phanhoi');
    const [form] = Form.useForm();
    const { visible, setVisible } = props;

    useEffect(() => {
        if (!visible) resetFieldsForm(form);
    }, [visible]);

const onFinish = async (values: any) => {
    const authToken = localStorage.getItem('authToken');
    console.log('authToken:', authToken); // Log giá trị authToken
    console.log('Form values:', values); // Log giá trị form trước khi xử lý

    if (!!values.urlPhanAnh && typeof values.urlPhanAnh !== 'string') {
        setFormSubmiting(true);
        await buildUpLoadFile(values, 'urlPhanAnh', undefined, authToken ? authToken : undefined)
            .then((urlPhanAnh) => (values.urlPhanAnh = urlPhanAnh))
            .catch(() => (values.urlPhanAnh = null))
            .finally(() => setFormSubmiting(false));
    }

    console.log('Processed values:', values); // Log giá trị form sau khi xử lý upload

    postModel({
        ...values,
        loaiPhanHoi: ELoaiPhanHoi.KY_THUAT,
    })
        .then(() => {
            setVisible(false);
        })
        .catch((er) => {
            console.error('Error in postModel:', er); // Log lỗi nếu xảy ra
        });
};

    return (
        <Card title='Phản hồi kĩ thuật'>
            <Form layout='vertical' onFinish={onFinish} form={form}>
                <Form.Item
                    rules={[...rules.required, ...rules.length(5000), ...rules.text]}
                    name='noiDungPhanHoi'
                    label='Mô tả chi tiết'
                >
                    <Input.TextArea rows={3} placeholder='Mô tả chi tiết' />
                </Form.Item>

                {/* Chỉ chấp nhận định dạng ảnh cho trường này */}
                <FormItemUrlOrUpload form={form} field='urlPhanAnh' accept="image/*" />

                <div className='form-footer'>
                    <Button loading={formSubmiting} htmlType='submit' type='primary'>
                        Gửi phản hồi
                    </Button>
                    <Button onClick={() => setVisible(false)}>Hủy</Button>
                </div>
            </Form>
        </Card>
    );
};

export default FormPostIssue;