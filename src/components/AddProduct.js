// src/components/AddProduct.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const token = sessionStorage.getItem('access_token');
const AddProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        product_name: '',
        original_source: '',
        consigner: '',
        start_price: 0,
        increment: 0,
        end_date: '',
        media: '',
        media_extra: [],
        thumbnails: [],
        seller_id: sessionStorage.getItem('id'),
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleMultiFileChangeExtra = (e) => {
        const files = Array.from(e.target.files);
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then((results) => {
            setProduct((prevState) => ({ ...prevState, media_extra: results }));
        });
    };

    const handleMultiFileChangeThumbnail = (e) => {
        const files = Array.from(e.target.files);
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then((results) => {
            setProduct((prevState) => ({ ...prevState, thumbnails: results }));
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://medakaauction.com/medaka/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(product)
            });
            const data = await response.json();
            alert(`상품 등록 완료: ${data.product_id}`);
            navigate('/');
        } catch (error) {
            alert('등록 실패');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="product_name" type="text" placeholder="상품명" value={product.product_name} onChange={handleChange} required />
            <input name="original_source" type="text" placeholder="출처" value={product.original_source} onChange={handleChange} required />
            <input name="consigner" type="text" placeholder="작출자" value={product.consigner} onChange={handleChange} required />
            <input name="start_price" type="number" placeholder="시작가" value={product.start_price} onChange={handleChange} required />
            <input name="increment" type="number" placeholder="호가 단위" value={product.increment} onChange={handleChange} required />
            <input name="end_date" type="datetime-local" placeholder="마감일" value={product.end_date} onChange={handleChange} required />
            <input name="description" type="text" placeholder="설명" value={product.description} onChange={handleChange} required />
            <input name="thumbnails" type="file" placeholder="썸네일" multiple accept='image/jpeg, image/png' onChange={handleMultiFileChangeThumbnail} required />
            <input name="media_extra" type="file" placeholder="상세 이미지" multiple accept='image/jpeg, image/png' onChange={handleMultiFileChangeExtra} />
            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProduct;
