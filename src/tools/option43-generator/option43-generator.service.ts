// from option43.org

function IPToHexDigit(ip_addr: string) { // Ruckus
  const arr1 = [];
  // ip_addr = ip_addr.split('.').join('');
  for (let n = 0, l = ip_addr.length; n < l; n++) {
    const hex = Number(ip_addr.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join('');
}

function IPToHexNumber(ip_addr: string) {
  const arr1 = [];
  const ips = ip_addr.split('.');
  for (let n = 0, l = ips.length; n < l; n++) {
    const hex = (`0${Number(ips[n]).toString(16)}`).slice(-2);
    arr1.push(hex);
  }
  return arr1.join('');
}

function IPCharCounter(ip_addr: string, ret: string) {
  if (ret === 'hex') {
    return (`0${ip_addr.length.toString(16)}`).slice(-2);
  }
  else {
    return ip_addr.length;
  }
}

function splitIPs(ip_addr: string) {
  const validIPs = [];
  const rows = ip_addr.split('\n');
  for (let n = 0, l = rows.length; n < l; n++) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(rows[n])) {
      validIPs.push(rows[n]);
    }
  }
  return validIPs;
}

function IPNumberCounter(ip_addr: string[]) {
  return ip_addr.length;
}

function renderSettings(
  dhcp_vendor: string,
  option43_type: string,
  option43_subtype: string,
  option43_value: string,
  option60_type: string | undefined,
  option60_value: string | undefined,
  vendor_link: string | undefined,
  diff_number: number | undefined) {
  let output;
  switch (dhcp_vendor) {
    case 'cisco_01':
      // option code [instance number] {ascii string | hex string | ip-address} // no quotation marks in option 43!
      output = '<p>Cisco CLI commands:</p><div class="cli"><p>option ';
      if (typeof diff_number !== 'undefined') {
        output = output + diff_number;
      }
      else { output = `${output}43`; }
      output = `${output} ${option43_type}`;
      output = `${output} ${option43_subtype}${option43_value}`;
      if (typeof option60_value !== 'undefined') {
        output = `${output}</p><p>option 60 ascii "${option60_value}"`;
      }
      output = `${output}</p></div><!--<p>More information: ${vendor_link}</p>-->`;
      return output;
    case 'juniper_01':
      // https://www.juniper.net/documentation/en_US/junos/topics/topic-map/dhcp-serever-options.html#id-configure-user-defined-dhcp-options

      output = '<p>Juniper EX CLI commands:</p><div class="cli"><p>set system services dhcp option  ';
      if (typeof diff_number !== 'undefined') {
        output = output + diff_number;
      }
      else { output = `${output}43`; }
      if (option43_type === 'ascii') {
        option43_type = 'string';
      }
      if (option60_type === 'ascii') {
        option60_type = 'string';
      }
      output = `${output} ${option43_type}`;
      output = `${output} ${option43_subtype}${option43_value}`;
      if (typeof option60_value !== 'undefined') {
        output = `${output}</p><p>set system services dhcp option 60 ascii "${option60_value}"`;
      }
      output = `${output}</p></div>`;
      return output;
    case 'juniper_02':
      // https://www.juniper.net/documentation/en_US/junos/topics/topic-map/dhcp-serever-options.html#id-configure-user-defined-dhcp-options

      output = '<p>Juniper SRX CLI commands:</p><div class="cli"><p>set access address-assignment pool <i>AP_DHCP_POOL</i> family inet dhcp-attributes option ';
      if (typeof diff_number !== 'undefined') {
        output = output + diff_number;
      }
      else { output = `${output}43`; }
      if (option43_type === 'ascii') {
        option43_type = 'string';
      }
      if (option43_type === 'hex') {
        option43_type = 'byte-stream';
      }
      output = `${output} ${option43_type}`;
      if (option43_type === 'byte-stream') {
        output = `${output} "0x${(option43_subtype + option43_value).match(/.{1,2}/g)?.join(' 0x')}"`;
      }
      else {
        output = `${output} ${option43_subtype}${option43_value}`;
      }
      if (option60_type === 'ascii') {
        option60_type = 'string';
      }
      if (typeof option60_value !== 'undefined') {
        output = `${output}</p><p>set access address-assignment pool <i>AP_DHCP_POOL</i> family inet dhcp-attributes option 60 ascii "${option60_value}"`;
      }
      output = `${output}</p></div>`;
      return output;
    default:
      output = '<p>Raw values:</p><p><b>Option ';
      if (typeof diff_number !== 'undefined') {
        output = output + diff_number;
      }
      else {
        output = `${output}43`;
      }
      output = `${output}</b><br />Type: "`;
      if (option43_type === 'ascii') {
        option43_type = 'String/ASCII';
      }
      if (option43_type === 'hex') {
        option43_type = 'Hexadecimal';
      }
      if (option43_type === 'ip') {
        option43_type = 'IP-Address';
      }
      if (option60_type === 'ascii') {
        option60_type = 'String/ASCII';
      }
      output = output + option43_type;
      output = `${output}"<br />Value: ${option43_subtype}${option43_value}`;
      if (typeof option60_value !== 'undefined') {
        output = `${output}</p><p><b>Option 60</b><br /> Type: "${option60_type}"<br />Value: "${option60_value}"`;
      }
      output = `${output}</p></div>`;
      return output;
  }
}

export function getOption43Infos(ip_addr: string, wifi_vendor: string, dhcp_vendor: string) {
  const ip_addr_array = splitIPs(ip_addr);
  const ip_addr_hexDigit = IPToHexDigit (ip_addr_array.join(',')); // Ruckus, comma separation
  const ip_addr_hexNumber = IPToHexNumber (ip_addr_array.join('.')); // valid for Cisco, no separation
  const ip_addr_hexNumber_first = IPToHexNumber (ip_addr_array[0]);

  const num_ips = IPNumberCounter (ip_addr_array);
  const num_ip_bytes = (`0${(num_ips * 4).toString(16)}`).slice(-2);

  let option43_type = ''; // hex, ascii, ip
  let option43_subtype = ''; // vendor prefix
  let option43_value;
  let diff_number;
  let option60_type; // hex, ascii, ip
  let option60_value;
  let vendor_link;

  switch (wifi_vendor) {
    case 'cisco_01':
      option43_type = 'hex';
      option43_subtype = 'f1';
      option43_value = num_ip_bytes + ip_addr_hexNumber;
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    case 'ruckus_01':
      option43_type = 'hex';
      option43_subtype = '06';
      option43_value = IPCharCounter (ip_addr_array.join(','), 'hex') + ip_addr_hexDigit;
      option60_type = 'ascii';
      option60_value = 'Ruckus CPE';
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    case 'ruckus_02':
      option43_type = 'hex';
      option43_subtype = '03';
      option43_value = IPCharCounter (ip_addr_array.join(','), 'hex') + ip_addr_hexDigit;
      option60_type = 'ascii';
      option60_value = 'Ruckus CPE';
      vendor_link = 'https://docs.commscope.com/bundle/zd-10.2-userguide/page/GUID-D5CF7FE0-D73F-4B4B-95C8-08CAB5B235D5.html';
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    case 'aruba_01':
      option43_type = 'ip';
      option43_value = ip_addr;
      option60_type = 'ascii';
      option60_value = 'ArubaAP';
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    case 'fortinet_01':
      option43_type = 'ip';
      option43_value = ip_addr_array.join(' ');
      // diff_number = 138;
      // option60_type = "ascii";
      // option60_value = "ArubaAP";
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    case 'fortinet_02':
      option43_type = 'ip';
      option43_value = ip_addr_array.join(' ');
      diff_number = 138;
      // option60_type = "ascii";
      // option60_value = "ArubaAP";
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    case 'ubiquiti_01':
      option43_type = 'hex';
      option43_subtype = '01';
      option43_value = `04${ip_addr_hexNumber_first}`;
      // option60_type = "ascii";
      // option60_value = "Ruckus CPE";
      // vendor_link = "https://docs.commscope.com/bundle/zd-10.2-userguide/page/GUID-D5CF7FE0-D73F-4B4B-95C8-08CAB5B235D5.html";
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    case 'cambium_01':
      option43_type = 'ascii';
      // option43_subtype = "01";
      option43_value = `"https://${ip_addr[0]}"`;
      // option60_type = "ascii";
      // option60_value = "Ruckus CPE";
      // vendor_link = "https://docs.commscope.com/bundle/zd-10.2-userguide/page/GUID-D5CF7FE0-D73F-4B4B-95C8-08CAB5B235D5.html";
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    case 'linux_01':
      return `Linux:<br />Option 43 (IP-address): ${ip_addr}<br /> You also <b>need</b>:<br />Option 60 (String): "ArubaAP".`;
    case 'netgear_01':
      option43_type = 'hex';
      option43_subtype = '0204';
      option43_value = ip_addr_hexNumber_first;
      return renderSettings(dhcp_vendor, option43_type, option43_subtype, option43_value, option60_type, option60_value, vendor_link, diff_number);
    default:
      return 'Not implemented';
  }
};
