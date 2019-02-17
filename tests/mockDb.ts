import { MongoClient } from 'mongodb';
import Bluebird from 'bluebird';
import dbService from './../src/services/dbService';

export default async function mockDb() {
    const db: any = await dbService.initializeDb();
    const collections: any = await dbService.createCollections(db);
    const candidatesCollection: any = collections.candidatesCollection;
    const votersCollection: any = collections.votersCollection;
    const votesCollection: any = collections.votesCollection;

    await candidatesCollection.deleteMany({});
    await votersCollection.deleteMany({});
    await votesCollection.deleteMany({});

    await candidatesCollection.insertOne({
        event: {
            logIndex: 0,
            transactionIndex: 0,
            transactionHash: '0x8c2a688816594628dfb49770c36dad6cc700979eaf1bfd6755e86f8f2716c243',
            blockHash: '0x6b31b0dbd119ccf4f66dd12c62fc809327466a2e2c79f1538c3e232044fd5456',
            blockNumber: 44,
            address: '0x9c4609E629A875afe07Ac1A8968078d63c1Fd798',
            type: 'mined',
            id: 'log_ca0077da',
            returnValues: {
                '0': '0xf6f6C0cb9C979B58cdB461e9214b8E69370EeC3B',
                _whiteListedAccount: '0xf6f6C0cb9C979B58cdB461e9214b8E69370EeC3B'
            },
            event: '_WhiteList',
            signature: '0x14c99c95843c55c4e6e3cd95be615861493e90f3919ff664169bfbe2839dbfb0',
            raw:
            {
                data: '0x000000000000000000000000f6f6c0cb9c979b58cdb461e9214b8e69370eec3b',
                topics:
                    ['0x14c99c95843c55c4e6e3cd95be615861493e90f3919ff664169bfbe2839dbfb0']
            }
        }
    });

    await votersCollection.insertOne({
        event: {
            logIndex: 0,
            transactionIndex: 0,
            transactionHash: '0x9aea6414662e194b84aa254acb6cca3e52104ae034444e9f7ad1440cdb8008f4',
            blockHash: '0x944da604ba39677847183cf25e2755bd1707e62a8aa128a3dfacdc0c7916685d',
            blockNumber: 35,
            address: '0x9c4609E629A875afe07Ac1A8968078d63c1Fd798',
            type: 'mined',
            id: 'log_66ecd8d8',
            returnValues: {
                '0': '0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D',
                _whiteListedAccount: '0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D'
            },
            event: '_WhiteList',
            signature: '0x14c99c95843c55c4e6e3cd95be615861493e90f3919ff664169bfbe2839dbfb0',
            raw:
            {
                data: '0x000000000000000000000000a7fb216cc527e071b1c68e5aa321d9625906f09d',
                topics:
                    ['0x14c99c95843c55c4e6e3cd95be615861493e90f3919ff664169bfbe2839dbfb0']
            }
        }
    });


    await votersCollection.insertOne({
        event: {
            'address': '0x5226b7904424D2a12055204b74A842558D525b38',
            'blockNumber': 2575362,
            'transactionHash': '0x1281f0af4d5f135adcbf7a1d6b8f686149adbb329ab1449b84dc6030f9757490',
            'transactionIndex': 3,
            'blockHash': '0x9e14aee5c7f18e5f405d21c1de3119a3d2140be4f214cd83fb36cc47c255fec4',
            'logIndex': 3,
            'removed': false,
            'id': 'log_88e4ca2e',
            'returnValues': {
                '0': '0x9B2828ef19b39De73d5F81A688dF35939AC5fDC0',
                '_whiteListedAccount': '0x9B2828ef19b39De73d5F81A688dF35939AC5fDC0'
            },
            'event': '_WhiteList',
            'signature': '0x14c99c95843c55c4e6e3cd95be615861493e90f3919ff664169bfbe2839dbfb0',
            'raw': {
                'data': '0x0000000000000000000000009b2828ef19b39de73d5f81a688df35939ac5fdc0',
                'topics': ['0x14c99c95843c55c4e6e3cd95be615861493e90f3919ff664169bfbe2839dbfb0']
            }
        }
    });

    await votesCollection.insertOne({
        event: {
            logIndex: 0,
            transactionIndex: 0,
            transactionHash: '0x777d588d62091be21393d32806e5a011f5e55b95d926bcc62892e9f80f0d7c63',
            blockHash: '0x757019ba0b3788bfb6f8b49828339e82b21555e83d7ee5dc85958cb602a0c649',
            blockNumber: 48,
            address: '0x63D00FB5982CC5bfDB7598ebcE5e5265186EAFB2',
            type: 'mined',
            id: 'log_f396f4ca',
            returnValues: {
                '0': '0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D',
                '1': '0x6F641912F3605BeA43a94a90555062ED590363db',
                '2': '10',
                '3': '0',
                _voterAddress: '0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D',
                _candidateAddress: '0xf6f6C0cb9C979B58cdB461e9214b8E69370EeC3B',
                _amount: 10,
                _periodIndex: 0
            },
            event: 'Vote',
            signature: '0x6a92c4ce4cbb892528ab39f7d674be0f6b1579b54ed8e77d95ad506819fd72c8',
            raw:
            {
                data: '0x000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000',
                topics:
                    ['0x6a92c4ce4cbb892528ab39f7d674be0f6b1579b54ed8e77d95ad506819fd72c8',
                        '0x000000000000000000000000a7fb216cc527e071b1c68e5aa321d9625906f09d',
                        '0x0000000000000000000000006f641912f3605bea43a94a90555062ed590363db']
            }
        }
    });

    await votesCollection.insertOne({
        event: {
            logIndex: 0,
            transactionIndex: 0,
            transactionHash: '0x92add3176dd7309823e654a3b55ca57b9ac93610228904245855c170e6403109',
            blockHash: '0x221e56250a9e5142b6e7600c2ef232eee766823fefd4e49959bc19ddc7268e70',
            blockNumber: 64,
            address: '0x7A2caA67Aa72E560dd887A8A009e5584265B9653',
            type: 'mined',
            id: 'log_ba5e9539',
            returnValues: {
                '0': '0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D',
                '1': '0x6F641912F3605BeA43a94a90555062ED590363db',
                '2': 10,
                '3': 0,
                _voterAddress: '0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D',
                _candidateAddress: '0xf6f6C0cb9C979B58cdB461e9214b8E69370EeC3B',
                _amount: 10,
                _periodIndex: 0
            },
            event: 'Vote',
            signature: '0x6a92c4ce4cbb892528ab39f7d674be0f6b1579b54ed8e77d95ad506819fd72c8',
            raw:
            {
                data: '0x000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000',
                topics:
                    ['0x6a92c4ce4cbb892528ab39f7d674be0f6b1579b54ed8e77d95ad506819fd72c8',
                        '0x000000000000000000000000a7fb216cc527e071b1c68e5aa321d9625906f09d',
                        '0x0000000000000000000000006f641912f3605bea43a94a90555062ed590363db']
            }
        }
    });

    return {
        candidatesCollection,
        votersCollection,
        votesCollection
    };
}