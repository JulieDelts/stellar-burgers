import { RootState } from '../root-reducer';

export const selectFeeds = (state: RootState) => state.feed.orders;
export const selectFeedsTotal = (state: RootState) => state.feed.total;
export const selectFeedsTotalToday = (state: RootState) =>
  state.feed.totalToday;
export const selectFeedsLoading = (state: RootState) => state.feed.loading;
export const selectFeedsError = (state: RootState) => state.feed.error;
