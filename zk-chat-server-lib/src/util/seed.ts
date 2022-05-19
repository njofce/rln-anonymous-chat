import { MerkleTreeZero } from "../persistence/model/merkle_tree/merkle_tree.model";
import Hasher from "./hasher";

const seedZeros = async (zeroValue: BigInt, treeLevels: number) => {
    const hasher = new Hasher();
    const zeroHashes = await MerkleTreeZero.findZeros();

    if (!zeroHashes || zeroHashes.length === 0) {
        for (let level = 0; level < treeLevels; level++) {
            zeroValue =
                level === 0 ? zeroValue : hasher.poseidonHash([zeroValue, zeroValue]);

            const zeroHashDocument = await MerkleTreeZero.create({
                level,
                hash: zeroValue.toString(),
            });

            await zeroHashDocument.save();
        }
    }
};

export {seedZeros}