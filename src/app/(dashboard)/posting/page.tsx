"use client"
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect, Fragment  } from 'react';
import AccountingCard from "@/compoents/AccountingCard"
import { Row, Col, Button } from "antd";
import { transactionService } from '@/services/transactionService';
import { DraftTransaction, TransactionStatus } from '@/types/transaction';
import { RedoOutlined } from '@ant-design/icons'



const Posting = () => {
    const [draftTransaction, setDraftTransaction] = useState<DraftTransaction[]>([])
    const [refresh, setRefresh] = useState(false)

    const getAllDraftTrasaction = async () => {
        const data = await transactionService.getAllDraftTrasaction()
        console.log(data)
        setDraftTransaction(data)
    }

    const onPost = async (transactionId: number) => {
        await transactionService.updateTransaction(transactionId, TransactionStatus.POSTED)
    }

    const onVoid = async (transactionId: number) => {
        await transactionService.updateTransaction(transactionId, TransactionStatus.VOIDED)

    }

    useEffect(()=>{
        getAllDraftTrasaction()
    },[refresh])

    return (
        <>
            <Row>
            <Button color="cyan" variant="solid" onClick={() => setRefresh(!refresh)} style={{ marginBottom: 16 }}>
                <RedoOutlined />
            </Button>
            </Row>
            <Row>
                {draftTransaction.map((data)=>
                    <Fragment key={data.transactionId}>
                        <Col span={11}>
                        <AccountingCard {...data} onPost={onPost} onVoid={onVoid}/>
                        </Col>
                        <Col span={1}/>
                    </Fragment>
                )}
            </Row>
        </>
    )
}

export default Posting