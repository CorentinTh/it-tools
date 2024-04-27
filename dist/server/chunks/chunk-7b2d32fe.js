import _ from 'lodash';

function ipv4ToInt({ ip }) {
  if (!isValidIpv4({ ip })) {
    return 0;
  }
  return ip.trim().split(".").reduce((acc, part, index) => acc + Number(part) * 256 ** (3 - index), 0);
}
function ipv4ToIpv6({ ip, prefix = "0000:0000:0000:0000:0000:ffff:" }) {
  if (!isValidIpv4({ ip })) {
    return "";
  }
  return prefix + _.chain(ip).trim().split(".").map((part) => Number.parseInt(part).toString(16).padStart(2, "0")).chunk(2).map((blocks) => blocks.join("")).join(":").value();
}
function isValidIpv4({ ip }) {
  const cleanIp = ip.trim();
  return /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(cleanIp);
}

export { isValidIpv4 as a, ipv4ToIpv6 as b, ipv4ToInt as i };
