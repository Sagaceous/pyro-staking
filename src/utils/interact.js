import { ethers } from 'ethers';
import pyroTokenABI from '../abi/pyro.json';
import stakingABI from '../abi/stakingabi.json';

export const PYRO_TOKEN_ADDRESS = '0xbF50e0b98131500dc17f1F13837BCe5223ab289E';
export const PYRO_TOKEN = new ethers.Contract(PYRO_TOKEN_ADDRESS, pyroTokenABI);

export const staking_address = '0xe2CB646CBd43003910313A678814C00607471a5D';
export const Staking = new ethers.Contract(staking_address, stakingABI);
