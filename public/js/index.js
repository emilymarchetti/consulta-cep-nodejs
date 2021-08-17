function clearFields() {
    $('#str_logradouro').val('');
    $('#str_bairro').val('');
    $('#str_localidade').val('');
    $('#str_uf').val('');
    $('#str_ibge').val('');
    $('#str_ddd').val('');
}

function searchByEndereco() {
    var uf = $('#cmb_uf option:selected').text();
    var localidade = $('#cmb_localidade option:selected').text();
    var logradouro = $('#str_logradouro_search').val();

    if (!uf) {
        alert('Por favor selecione uma UF.');
        return;
    }

    if (!localidade) {
        alert('Por favor selecione uma localidade.');
        return;
    }

    if (!logradouro) {
        alert('Por favor informe um logradouro.');
        return;
    }

    $.ajax({
        url: '/getCepByEndereco',
        data: { 'uf': uf, 'localidade': localidade, 'logradouro': logradouro },
        type: 'GET',
        beforeSend: function () {
            $('#loading').show();
        },
        complete: function () {
            $('#loading').hide();
        },
        dataType: 'json',
        success: buildTableCeps,
        error: function () {
            alert('Não foi possível buscar o CEP por endereço.');
        }
    });;
}

function buildTableCeps(response) {
    if ('erro' in response) {
        alert('Nenhum CEP encontrado');
        $table_cep.hide();
        return;
    }

    response = response.slice(0, 10); // Mostro apenas os 10 primeiros ceps encontrados
    var $table_cep = $('#table_cep');
    var $table_cep_tbody = $table_cep.find('tbody');
    $table_cep_tbody.empty();
    var itens_html = '';

    if (response.length == 0) {
        alert('Nenhum CEP encontrado');
        $table_cep.hide();
        return;
    }

    $table_cep.show();
    $.each(response, function (index, item) {
        itens_html += '<tr>' +
            '<td></td>' +
            '<td>' + item.cep + '</td>' +
            '<td>' + item.logradouro + '</td>' +
            '<td>' + item.bairro + '</td>' +
            '<td>' + item.complemento + '</td>' +
            '</tr>';
    });
    $table_cep_tbody.append(itens_html);
}

function getUf() {
    $.ajax({
        url: '/getUf',
        type: 'GET',
        dataType: 'json',
        success: setUf,
        error: function () {
            alert('Não foi possível buscar os estados.');
        }
    });
}

function setUf(response) {
    if ('erro' in response) {
        alert('Nenhuma UF encontrada');
        return;
    }

    var $cmb_uf = $('#cmb_uf');
    $cmb_uf.empty();

    $cmb_uf.append($('<option>', {
        value: '',
        text: ''
    }));

    $.each(response, function (index, item) {
        $cmb_uf.append($('<option>', {
            value: item.id,
            text: item.sigla
        }));
    });
}

function getCidades() {
    var uf = $('#cmb_uf').val();
    var $cmb_localidade = $('#cmb_localidade');

    if (!uf) {
        $cmb_localidade.val();
        $cmb_localidade.attr('disabled', 'disabled');
        return;
    }

    $cmb_localidade.removeAttr('disabled');

    $.ajax({
        url: '/getCidades',
        data: { 'uf': uf },
        type: 'GET',
        beforeSend: function () {
            $('#loading').show();
        },
        complete: function () {
            $('#loading').hide();
        },
        dataType: 'json',
        success: setCidades,
        error: function () {
            alert('Não foi possível buscar as cidades.');
            clearFields();
        }
    });;
}

function setCidades(response) {
    if ('erro' in response) {
        alert('Nenhuma cidade encontrada');
        return;
    }

    var $cmb_localidade = $('#cmb_localidade');
    $cmb_localidade.empty();

    $.each(response, function (index, item) {
        $cmb_localidade.append($('<option>', {
            value: item.id,
            text: item.nome
        }));
    });
}

function buscarCep() {
    var cep = $('#str_cep').val();

    $.ajax({
        url: '/getCep',
        data: { 'cep': cep },
        type: 'GET',
        dataType: 'json',
        success: setCep,
        error: function () {
            alert('Não foi possível buscar o CEP.');
            clearFields();
        }
    });;
}

function setCep(response) {
    if ('erro' in response) {
        clearFields();
        alert('CEP não encontrado.')
        return;
    }
    $('#str_logradouro').val(response.logradouro);
    $('#str_bairro').val(response.bairro);
    $('#str_localidade').val(response.localidade);
    $('#str_uf').val(response.uf);
    $('#str_ibge').val(response.ibge);
    $('#str_ddd').val(response.ddd);
}


$(document).ready(function () {
    var $str_cep = $('#str_cep');
    var $cmb_uf = $('#cmb_uf');
    $str_cep.mask('00000-000', { reverse: true });

    $str_cep.off('change').on('change', function () {
        buscarCep();
    });

    $cmb_uf.off('change').on('change', function () {
        getCidades();
    });

    getUf();
});