import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-store-selection-modal',
  templateUrl: './store-selection-modal.component.html',
  styleUrls: ['./store-selection-modal.component.scss']
})
export class StoreSelectionModalComponent {
  stores = [
    { id: '711-001', name: '7-ELEVEN 台北門市', address: '台北市信義區市府路1號' },
    { id: '711-002', name: '7-ELEVEN 新北門市', address: '新北市板橋區縣民大道2號' },
    { id: 'fm-001', name: '全家 台北門市', address: '台北市大安區忠孝東路3段' },
    { id: 'fm-002', name: '全家 新北門市', address: '新北市中和區中正路4段' }
  ];

  selectedStore: any;

  constructor(
    public dialogRef: MatDialogRef<StoreSelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onSelectStore(store: any): void {
    this.selectedStore = store;
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedStore);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}