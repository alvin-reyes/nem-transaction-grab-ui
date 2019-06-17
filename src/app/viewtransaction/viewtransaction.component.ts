import {Input, Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {DataTableDirective, DataTablesModule} from 'angular-datatables';
import {Subject} from 'rxjs/Rx';
import {HttpClient} from '@angular/common/http';
declare var $;

const server = 'localhost:8081'; //
const nemData = {
  'networks': [
    {
      'name': 'mainnet',
      'nodes': [
        '62.75.171.41',
        'sam.nem.ninja',
        'go.nem.ninja',
        'hachi.nem.ninja',
        'jusan.nem.ninja',
        'nijuichi.nem.ninja',
        'alice2.nem.ninja',
        'alice3.nem.ninja',
        'alice4.nem.ninja',
        'alice5.nem.ninja',
        'alice6.nem.ninja',
        'alice7.nem.ninja',
        'Custom'
      ]
    },
    {
      'name': 'testnet',
      'nodes': [
        'bob.nem.ninja',
        '104.128.226.60',
        '23.228.67.85',
        '192.3.61.243',
        '50.3.87.123',
        'Custom'
      ]
    },
    {
      'name': 'mijinnet',
      'nodes': [
        'a1.dfintech.com',
        'a2.dfintech.com',
        'a3.dfintech.com',
        'a4.dfintech.com',
        'Custom'
      ]
    }
  ]
};

@Component({
  selector: 'app-viewtransaction',
  templateUrl: './viewtransaction.component.html',
  styleUrls: ['./viewtransaction.component.css']
})
export class ViewTransactionComponent implements OnInit {
  @ViewChild('overlay') input: ElementRef;
  @ViewChild('selectElem') selectElemNetwork: ElementRef;
  @ViewChild('selectElemHost') selectElemHost: ElementRef;

  address: string;
  host = 'alice2.nem.ninja';
  customHost: string;
  port = '7890';
  network: string;
  table = null;
  enableCustom = false;
  errorFlag = false;
  errorMessage: string;
  renderDone = false;
  total: string;
  lastHash: string;
  selectedNetwork = [];
  showloading = false;

  constructor(private http: HttpClient) {
    $(function() {
      $.fn.dataTable.ext.errMode = 'none';
      this.table = $('#allTrans').DataTable();
      $('#errorPane').css('display', 'none');
      $('#totalPane').css('display', 'none');
      $('#incomingTotalPane').css('display', 'none');
      $('#outgoingTotalPane').css('display', 'none');
      $('#totalMosaics').css('display', 'none');
    });
    this.network = 'mainnet'; //
    this.networkChange('mainnet'); // default

  }

  scroll = (): void => {
    console.log($(window).scrollTop() + '::' + $(window).height() + '::' + $(document).height());
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      var hash = $('#hiddenLastHash').html();
      $(window).unbind('scroll');
      window.removeEventListener('scroll', this.scroll);
      this.addRow(this.network, this.host, this.port, this.address, hash);
      window.addEventListener('scroll', this.scroll, true);
    }
  };

  networkChange(selectElemValue: string) {
    $('#errorPane').css('display', 'none');
    console.log(selectElemValue);
    this.selectedNetwork = [];
    this.selectedNetwork = nemData.networks.filter(value => value.name === selectElemValue);
    console.log('P:' + this.selectedNetwork[0].nodes[0]);
    this.host = this.selectedNetwork[0].nodes[0];
    console.log(this.selectedNetwork);
    this.network = selectElemValue;
    this.enableCustom = false;
  }
  hostChange(selectElemValue: string) {
    $('#errorPane').css('display', 'none');
    console.log(selectElemValue);
    this.enableCustom = false;
    this.customHost = '';
    if (selectElemValue == 'Custom') {
      this.enableCustom = true;
    }
    this.host = selectElemValue;
  }

  hostChangeBlur() {
    $('#errorPane').css('display', 'none');
    console.log(this.customHost);
    console.log(this.host);
    this.host = this.customHost;
  }

  ngOnInit(): void {
    console.log('.... ngOnInit()' + this.address);
  }

  validateRequiredField(val: string) {
    console.log('val:' + val);
    if (val == null || val == 'undefined' || val == '') {
      $(function() {
        $('#errorPane').css('display', 'block');
        $('#errorId').html('Address field is required and must be valid');
        $('#overlay').hide();
      });
      return false;
    }


    if (val != null) {
      console.log(this.address[0]);
      // check correct address format.
      if (this.network == 'mainnet' && this.address[0] != 'N') {
        $(function() {
          $('#errorPane').css('display', 'block');
          $('#errorId').html('Address is not valid for ' + this.network + ' network.');
          $('#overlay').hide();
        });
        return false;
      }
      if (this.network == 'testnet' && this.address[0] != 'T') {
        $(function() {
          $('#errorPane').css('display', 'block');
          $('#errorId').html('Address is not valid for ' + this.network + ' network.');
          $('#overlay').hide();
        });
        return false;
      }
      if (this.network == 'mijinnet' && this.address[0] != 'M') {
        $(function() {
          $('#errorPane').css('display', 'block');
          $('#errorId').html('Address is not valid for ' + this.network + ' network.');
          $('#overlay').hide();
        });
        return false;
      }

      //  check regex.
      var addressWoDash = this.address.replace(/-/g, '');
      console.log(addressWoDash);
      var a = new RegExp('[nN]{1,1}[a-zA-Z0-9]{5,5}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{4,4}');
    }

    return true;
  }

  addRow(network, host, port, address, hash) {
    this.input.nativeElement.style = 'display:block;';
    var servicePort = '8081';
    if (network == 'mainnet') {
      servicePort = '8081';
    } else if (network == 'testnet') {
      servicePort = '8082';
    } else if (network == 'mijinnet') {
      servicePort = '8083';
    }
    console.log(hash);
    this.showloading = true;
    var addressWoDash = address.replace(/-/g, '');
    this.http.get('http://138.197.132.50:' + servicePort + '/transgrab/s/network/' + network + '/host/' + host + '/port/' + port + '/address/' + addressWoDash + '/hash/' + hash).subscribe(data => {
      // Read the result field from the JSON response.
      $(function() {
        $('#overlay').show();
        var outgoingTotal = 0;
        var incomingTotal = 0;
        var harvestInfoTotal = (data['harvestFeeTotal'] == undefined ? 0 : data['harvestFeeTotal']);
        var total = 0;

        for (let index = 0; index < data['data'].length; index++) {
          this.table.row.add({
            'sender': data['data'][index]['sender'],
            'recipient': data['data'][index]['recipient'],
            'currencyType': data['data'][index]['currencyType'],
            'amount': data['data'][index]['amount'],
            'fee': data['data'][index]['fee'],
            'amountTotal': data['data'][index]['amountTotal'],
            'mosaics': data['data'][index]['mosaics'],
            'date': data['data'][index]['date'],
            'message': data['data'][index]['message'],
            'hash': data['data'][index]['hash'],
            'transactionType': data['data'][index]['transactionType']
          }).draw(false);
        }
        if (data['data'].length > 0) {
          for (let index = 0; index < data['data'].length; index++) {
            if (data['data'][index]['transactionType'] == 'OUTGOING') {
              outgoingTotal += data['data'][index]['amountTotal'];
            }
            if (data['data'][index]['transactionType'] == 'INCOMING') {
              incomingTotal += data['data'][index]['amountTotal'];
            }
            total += data['data'][index]['amountTotal'];
          }
          $('#total').html((Math.abs(((incomingTotal - outgoingTotal) + harvestInfoTotal)) / 1000000).toFixed(6));
          $('#incomingTotal').html(incomingTotal);
          $('#outgoingTotal').html(outgoingTotal);
          $('#hiddenLastHash').html(data['data'][data['data'].length - 1]['hash']);
        }
        $('#overlay').hide();

      });
    });

  }

  dtAllTransTF(network, host, port, address) {
    var servicePort = '8081';
    if (network == 'mainnet') {
      servicePort = '8081';
    } else if (network == 'testnet') {
      servicePort = '8082';
    } else if (network == 'mijinnet') {
      servicePort = '8083';
    }
    console.log(servicePort);
    $(function() {
      $('#overlay').show();
      $('#total').html('000000000');
      $('#incomingTotal').html('000000000');
      $('#outgoingTotal').html('000000000');
      $('#errorPane').css('display', 'none');
      $('#totalPane').css('display', 'block');
      $('#incomingTotalPane').css('display', 'block');
      $('#outgoingTotalPane').css('display', 'block');
      var addressWoDash = address.replace(/-/g, '');
      var outgoingTotal = 0;
      var incomingTotal = 0;
      var total = 0;
      this.table = $('#allTrans').DataTable({
        'ajax': 'http://138.197.132.50:' + servicePort + '/transgrab/s/network/' + network + '/host/' + host + '/port/' + port + '/address/' + addressWoDash + '/25',
        'bPaginate': false,
        'bLengthChange': true,
        'bFilter': true,
        'bInfo': true,
        'bAutoWidth': true,
        'scrollCollapse': true,
        dom: 'Bfrtip',
        'order': [[8, 'desc']],
        buttons: [
          'copy',
          'print',
          {
            extend: 'excelHtml5',
            title: address + '_' + new Date().getTime()
          },
          {
            extend: 'pdfHtml5',
            title: address + '_' + new Date().getTime()
          },
          {
            extend: 'csv',
            title: address + '_' + new Date().getTime()
          },
        ],
        'columns': [
          {'data': 'transactionType'},
          {'data': 'sender'},
          {'data': 'recipient'},
          {'data': 'currencyType'},
          {
            'data': 'amount',
            'render': function(data, type, row) {
              return data / 1000000;
            }
          },
          {
            'data': 'fee',
            'render': function(data, type, row) {
              return data / 1000000;
            }
          },
          {
            'data': 'amountTotal',
            'render': function(data, type, row) {
              return data / 1000000;
            }
          },
          {
            'data': 'mosaics',
            'render': function(data, type, row) {
              if (data == null || data == '') {
                return '';
              }
              var txt = '';
              data.forEach(function(item) {
                if (txt.length > 0) {
                  txt += ', '
                }
                txt += item.name + ' ' + item.quantity;
              });
              return txt;
            }
          },
          {'data': 'date'},
          {'data': 'message'},
          {'data': 'hash'},
          {
            'data': 'hash',
            'render': function(data, type, row) {
              var txt = '';
              txt += '<a target=\'_blank\' href=\'http://alice2.nem.ninja:7890/transaction/get?hash=' + data + '\'>JSON</a>&nbsp|&nbsp';
              txt += '<a target=\'_blank\' href=\'http://chain.nem.ninja/#/transfer/' + data + '\'>NEM Block Explorer</a>';
              return txt;
            }

          }

        ],
        'footerCallback': function(row, data, start, end, display) {
          var harvestInfoTotal = (data['harvestFeeTotal'] == undefined ? 0 : data['harvestFeeTotal']);
          if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              var amount = data[index]['amount'];
              var fee = data[index]['fee'];
              if (data[index]['transactionType'] == 'OUTGOING' && data[index]['currencyType'] == 'nem:xem') {
                outgoingTotal = (parseFloat('' + outgoingTotal) + parseFloat(('' + (amount - fee))));
              } else if (data[index]['transactionType'] == 'INCOMING' && data[index]['currencyType'] == 'nem:xem') {
                var amount = data[index]['amount'];
                incomingTotal = (parseFloat('' + incomingTotal) + parseFloat(amount));
              }
              total += data[index]['amountTotal'];
            }
            $('#total').html((Math.abs(((incomingTotal - outgoingTotal) + harvestInfoTotal)) / 1000000).toFixed(6));
            $('#incomingTotal').html(incomingTotal.toFixed(6));
            $('#outgoingTotal').html(outgoingTotal.toFixed(6));
            $('#hiddenLastHash').html(data[data.length - 1]['hash']);
          }
        },
        'initComplete': function(settings, json) {
          $('#filterBar').css('display', 'block');
          this.api().columns(3).every(function() {
            var column = this;
            var select = $('<select class="custom-select"><option value="">Filter by Currency</option><option value="">All</option></select>')
              .appendTo($('#currencyFilter').empty())
              .on('change', function() {
                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });

            column.data().unique().sort().each(function(d, j) {
              select.append('<option value="' + d + '">' + d + '</option>')
            });
          });
          this.api().columns(0).every(function() {
            var column = this;
            var select = $('<select class="custom-select"><option value="">Filter by Incoming/Outgoing</option>')
              .appendTo($('#incomingOutgoingFilter').empty())
              .on('change', function() {
                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });

            column.data().unique().sort().each(function(d, j) {
              select.append('<option value="' + d + '">' + d + '</option>')
            });
          });
          if (json['data'].length > 0) {
            this.lastHash = json['data'][json['data'].length - 1]['hash'];
            $('#hiddenLastHash').html(this.lastHash);
          }
          $('#overlay').hide();
        }
      })
        .on('error.dt', function(e, settings, techNote, message) {
          this.errorFlag = true;
          this.errorMessage = 'Failed to retrieve Data. Please check if you entered a valid Address';
          console.log('An error has been reported by DataTables: ', message);
          $('#errorPane').css('display', 'block');
          $('#errorId').html('Error occured when accessing the Node. Please try another one.');

        });

    });
  }
  dtAllTrans(url, network, host, port, address) {

    var servicePort = '8081';
    var port = port;
    if (network == 'mainnet') {
      servicePort = '8081';
    } else if (network == 'testnet') {
      servicePort = '8082';
    } else if (network == 'mijinnet') {
      servicePort = '8083';
      port = '7895';
    }
    $(function() {
      $('#overlay').show();
      $('#total').html('000000000');
      $('#incomingTotal').html('000000000');
      $('#outgoingTotal').html('000000000');
      $('#errorPane').css('display', 'none');
      var addressWoDash = address.replace(/-/g, '');

      this.table = $('#allTrans').DataTable({
        'ajax': 'http://138.197.132.50:' + servicePort + url + 'network/' + network + '/host/' + host + '/port/' + port + '/address/' + addressWoDash,
        'bPaginate': false,
        'bLengthChange': true,
        'bFilter': true,
        'bInfo': true,
        'bAutoWidth': true,
        'scrollCollapse': true,
        dom: 'Bfrtip',
        'order': [[8, 'desc']],
        buttons: [
          'copy',
          'print',
          {
            extend: 'excelHtml5',
            title: address + '_' + new Date().getTime()
          },
          {
            extend: 'pdfHtml5',
            title: address + '_' + new Date().getTime()
          },
          {
            extend: 'csv',
            title: address + '_' + new Date().getTime()
          },
        ],
        'columns': [
          {'data': 'transactionType'},
          {'data': 'sender'},
          {'data': 'recipient'},
          {'data': 'currencyType'},
          {
            'data': 'amount',
            'render': function(data, type, row) {
              return data / 1000000;
            }
          },
          {
            'data': 'fee',
            'render': function(data, type, row) {
              return data / 1000000;
            }
          },
          {
            'data': 'amountTotal',
            'render': function(data, type, row) {
              return data / 1000000;
            }
          },
          {
            'data': 'mosaics',
            'render': function(data, type, row) {
              if (data == null || data == '') {
                return '';
              }
              var txt = '';
              data.forEach(function(item) {
                if (txt.length > 0) {
                  txt += ', '
                }
                txt += item.name + ' ' + (item.quantity / Math.pow(10, item.divisibility));
              });
              return txt;
            }
          },
          {'data': 'date'},
          {'data': 'message'},
          {'data': 'hash'},
          {
            'data': 'hash',
            'render': function(data, type, row) {
              var txt = '';
              txt += '<a target=\'_blank\' href=\'http://alice2.nem.ninja:7890/transaction/get?hash=' + data + '\'>JSON</a>&nbsp|&nbsp';
              txt += '<a target=\'_blank\' href=\'http://chain.nem.ninja/#/transfer/' + data + '\'>NEM Block Explorer</a>';
              return txt;
            }

          }

        ],
        'footerCallback': function(row, data, start, end, display) {
          var api = this.api(), data;
          console.log('len: ' + data.length);
          if (data.length > 0) {
            var outgoingTotal = 0;
            var incomingTotal = 0;
            var harvestInfoTotal = (data['harvestFeeTotal'] == undefined ? 0 : data['harvestFeeTotal']);
            var total = 0;
            var mosaics = [];
            for (let index = 0; index < data.length; index++) {
              var amount = data[index]['amount'];
              var fee = data[index]['fee'];
              if (data[index]['transactionType'] == 'OUTGOING' && data[index]['currencyType'] == 'nem:xem') {
                outgoingTotal = (parseFloat('' + outgoingTotal) + parseFloat(('' + (amount))));
              } else if (data[index]['transactionType'] == 'INCOMING' && data[index]['currencyType'] == 'nem:xem') {
                var amount = data[index]['amount'];
                incomingTotal = (parseFloat('' + incomingTotal) + parseFloat(amount));
              }
              total += data[index]['amountTotal'];

              var found = mosaics.filter(function(item) {return item.name == data[index]['currencyType'] && item.type == data[index]['transactionType']});
              if (found.length == 0) {
                var mosaicEntry = {name: data[index]['currencyType'], sum: data[index]['amount'], type: data[index]['transactionType'], divisibility: data[index]['divisibility']};
                mosaics.push(mosaicEntry)
              } else {
                var amount = data[index]['amount'];
                found[0]['sum'] = parseFloat(found[0]['sum']) + parseFloat(amount);
              }
            }
            var mosaicStr = '';
            var divisibility = mosaics[0].divisibility;
            for (var mindx = 0; mindx < mosaics.length; mindx++) {
              var io = (mosaics[mindx].type == 'INCOMING' ? 'IN' : 'OUT');
              mosaicStr += io + ' : ' + mosaics[mindx].name + ' : ' + (mosaics[mindx].sum) / Math.pow(10, mosaics[mindx].divisibility) + '</br>';
            }

            $('#total').html((Math.abs(((incomingTotal - outgoingTotal) + harvestInfoTotal)) / 1000000).toFixed(divisibility));
            $('#incomingTotal').html((incomingTotal / 1000000).toFixed(divisibility));
            $('#outgoingTotal').html((outgoingTotal / 1000000).toFixed(divisibility));
            $('#mosaicTotalFilter').html(mosaicStr);
            $('#hiddenLastHash').html(data[data.length - 1]['hash']);
          }

        },
        'initComplete': function(settings, json) {
          $('#filterBar').css('display', 'block');
          this.api().columns(3).every(function() {
            var column = this;
            $('#filterBar').css('display', 'block');
            var select = $('<select class="custom-select"><option value="">Filter by Currency</option><option value="">All</option></select>')
              .appendTo($('#currencyFilter').empty())
              .on('change', function() {
                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });
            column.data().unique().sort().each(function(d, j) {
              select.append('<option value="' + d + '">' + d + '</option>')
            });
          });
          this.api().columns(0).every(function() {
            var column = this;
            var select = $('<select class="custom-select"><option value="">Filter by Incoming/Outgoing</option>')
              .appendTo($('#incomingOutgoingFilter').empty())
              .on('change', function() {
                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });

            column.data().unique().sort().each(function(d, j) {
              select.append('<option value="' + d + '">' + d + '</option>')
            });
          });
          if (json['data'].length > 0) {
            this.lastHash = json['data'][json['data'].length - 1]['hash'];
            $('#hiddenLastHash').html(this.lastHash);
          }
          $('#overlay').hide();
        }
      })
        .on('error.dt', function(e, settings, techNote, message) {
          $(function() {
            $('#errorPane').css('display', 'block');
            $('#errorId').html('Failed to retrieve Data. Please check the given address and try again.');
            console.log('An error has been reported by DataTables: ', message);
            $('#overlay').hide();
          });

        });

    });
  }

  dataLoad(transType: string) {
    let url = '';
    $(function() {
      $('#errorPane').css('display', 'none');
      $('#totalPane').css('display', 'none');
      $('#incomingTotalPane').css('display', 'none');
      $('#outgoingTotalPane').css('display', 'none');
      $('#totalMosaics').css('display', 'none');
    });
    if (transType == 'ALL') {
      $(function() {
        $('#totalPane').css('display', 'block');
        $('#incomingTotalPane').css('display', 'block');
        $('#outgoingTotalPane').css('display', 'block');
        $('#totalMosaics').css('display', 'block');
      });
      url = '/transgrab/s/';
    }
    if (transType == 'INCOMING') {
      url = '/transgrab/s/incoming/';
    }
    if (transType == 'OUTGOING') {
      url = '/transgrab/s/outgoing/';
    }

    this.dtAllTrans(url, this.network, this.host, this.port, this.address);
  }

  filterByFirst25Only() {
    var hash = $('#hiddenLastHash').html();
    if (hash != '') {
      this.addRow(this.network, this.host, this.port, this.address, hash);
    } else {
      this.errorFlag = false;
      if (!this.validateRequiredField(this.address)) {console.log('... >>'); return }
      $(function() {
        // this.table.ajax.reload();
        this.table.destroy();
      });
      this.dtAllTransTF(this.network, this.host, this.port, this.address);
    }
    return;

  }

  getAllTransactions() {
    this.errorFlag = false;
    if (!this.validateRequiredField(this.address)) {console.log('... >>'); return }
    $(function() {
      // this.table.ajax.reload();
      this.table.destroy();
    });
    this.dataLoad('ALL');
  }

  filterByIncomingOnly() {
    this.errorFlag = false;
    if (!this.validateRequiredField(this.address)) {console.log('... >>'); return }
    $(function() {
      // this.table.ajax.reload();
      this.table.destroy();
    });
    this.dataLoad('INCOMING');
    // this.dtAllIncomingTrans(this.network, this.host, this.port, this.address);
  }
  filterByOutgoingOnly() {
    this.errorFlag = false;
    if (!this.validateRequiredField(this.address)) {console.log('... >>'); return }
    $(function() {
      // this.table.ajax.reload();
      this.table.destroy();
    });
    this.dataLoad('OUTGOING');
    // this.dtAllOutgoingTrans(this.network, this.host, this.port, this.address);
  }
  closeError() {
    this.errorFlag = false;
    this.errorMessage = '';
  }
  closeErrorPane() {
    $(function() {
      $('#errorPane').css('display', 'none');
    });
  }
}
