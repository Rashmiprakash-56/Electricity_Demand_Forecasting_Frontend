import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { DemandTableProps } from '../types/common';



const DemandTable: React.FC<DemandTableProps> = ({ rows }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        maxHeight: 420,
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Hour</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Actual Demand
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Predicted Demand
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              MAPE (%)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            const isOver = row.predicted_demand > row.actual_demand;
            const isUnder = row.predicted_demand < row.actual_demand;
            const isHighError = row.hourly_mape > 5;

            return (
              <TableRow
                key={row.hour}
                hover
                sx={{
                  backgroundColor: isOver
                    ? '#fef2f2' //  over-prediction 
                    : isUnder
                    ? '#eff6ff' //  under-prediction 
                    : 'inherit',
                }}
              >
                <TableCell>{row.hour}</TableCell>

                <TableCell align="right">
                  {row.actual_demand.toFixed(2)}
                </TableCell>

                <TableCell align="right">
                  {row.predicted_demand.toFixed(2)}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: isHighError ? '#dc2626' : '#16a34a',
                  }}
                >
                  {row.hourly_mape.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DemandTable;
