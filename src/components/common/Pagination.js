import React from 'react';
import { DefaultButton, Text } from '@fluentui/react';

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="pagination" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <DefaultButton onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</DefaultButton>
    <Text>{page} / {totalPages}</Text>
    <DefaultButton onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</DefaultButton>
  </div>
);

export default Pagination;
