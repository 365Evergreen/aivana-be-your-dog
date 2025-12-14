import React from 'react';
import { Text } from '@fluentui/react';
import Button from './Button';

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="pagination" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</Button>
    <Text>{page} / {totalPages}</Text>
    <Button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</Button>
  </div>
);

export default Pagination;
