import { useAtom } from 'jotai';
import { chatAtom, contactAtom, groupAtom,  } from '../state/atoms';

export function useChat() {
  return useAtom(chatAtom);
}

export function useContact() {
  return useAtom(contactAtom);
}

export function useGroup() {
  return useAtom(groupAtom);
}
