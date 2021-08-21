import { ICommand } from '../models';

import protocolList from './protocols_list';
import protocolGet from './protocols_get';
import protocolProposals from './protocols_proposals';

const commands: ICommand[] = [
  protocolList,
  protocolGet,
  protocolProposals,
];

export default commands;
