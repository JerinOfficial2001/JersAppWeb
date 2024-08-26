// src/state/atoms.ts

import { Chat, Contact, Group } from '@/types/model';
import { atom } from 'jotai';

type ChatConfig = {
  selected: Chat['_id'] | null;
};

type ContactConfig = {
  selected: Contact['_id'] | null;
};

type GroupConfig = {
  selected: Group['_id'] | null;
};

export const chatAtom = atom<ChatConfig>({
  selected: null,
});

export const contactAtom = atom<ContactConfig>({
  selected: null,
});

export const groupAtom = atom<GroupConfig>({
  selected: null,
});
